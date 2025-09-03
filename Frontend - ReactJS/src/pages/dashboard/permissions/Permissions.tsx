import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Search, Save } from 'lucide-react';
import apiService from '@/services/api';
import { useClinic } from '@/contexts/ClinicContext';

type RoleSummary = {
  _id: string;
  name: string;
  display_name?: string;
  is_system_role: boolean;
  permissions: string[]; // permission names
};

type PermissionItem = {
  name: string;
  display_name: string;
  category?: string;
};

const Permissions: React.FC = () => {
  const { currentClinic } = useClinic();
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  const selectedRole = useMemo(() => roles.find(r => r._id === selectedRoleId) || null, [roles, selectedRoleId]);

  useEffect(() => {
    const load = async () => {
      // Backend endpoints assumed: /permissions (list) and /roles (list with permissions)
      const [permRes, roleRes] = await Promise.all([
        apiService.get<{ success: boolean; data: { permissions: PermissionItem[] } }>(`/permissions`),
        apiService.get<{ success: boolean; data: { roles: Array<{ _id: string; name: string; display_name?: string; is_system_role: boolean; effective_permissions?: string[] }> } }>(`/roles`),
      ]);

      const perms = permRes.data?.permissions || [];
      setPermissions(perms);

      const mappedRoles: RoleSummary[] = (roleRes.data?.roles || []).map(r => ({
        _id: r._id,
        name: r.name,
        display_name: r.display_name,
        is_system_role: r.is_system_role,
        permissions: r.effective_permissions || [],
      }));
      setRoles(mappedRoles);
      if (mappedRoles.length > 0) setSelectedRoleId(mappedRoles[0]._id);
    };
    load().catch(console.error);
  }, []);

  const togglePermission = (perm: string) => {
    if (!selectedRole) return;
    setRoles(prev => prev.map(r => r._id === selectedRole._id ? {
      ...r,
      permissions: r.permissions.includes(perm)
        ? r.permissions.filter(p => p !== perm)
        : [...r.permissions, perm]
    } : r));
  };

  const saveChanges = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      // Backend endpoint assumed: PUT /roles/:id/permissions { permissions: string[] }
      await apiService.put(`/roles/${selectedRole._id}/permissions`, {
        permissions: selectedRole.permissions
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredPermissions = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return permissions;
    return permissions.filter(p => p.name.toLowerCase().includes(q) || p.display_name.toLowerCase().includes(q));
  }, [permissions, filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6"/> Permissions</h1>
          <p className="text-muted-foreground">Manage role permissions {currentClinic ? `for ${currentClinic.name}` : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles list */}
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Select a role to manage permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map(role => (
              <button
                key={role._id}
                onClick={() => setSelectedRoleId(role._id)}
                className={`w-full flex items-center justify-between p-3 rounded-md border ${selectedRoleId === role._id ? 'bg-primary/5 border-primary' : 'border-muted'}`}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={role.is_system_role ? 'default' : 'secondary'} className="capitalize">{role.name}</Badge>
                  {role.display_name && <span className="text-sm text-muted-foreground">{role.display_name}</span>}
                </div>
                <span className="text-xs text-muted-foreground">{role.permissions.length} perms</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Permissions matrix */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardTitle>Permissions</CardTitle>
              <Button size="sm" onClick={saveChanges} disabled={!selectedRole || saving}>
                <Save className="h-4 w-4 mr-2"/>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search permissions..." className="pl-9" value={filter} onChange={e => setFilter(e.target.value)} />
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            {!selectedRole ? (
              <div className="text-sm text-muted-foreground">Select a role to view and update its permissions.</div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2 max-h-[60vh] overflow-auto pr-1">
                {filteredPermissions.map(perm => {
                  const checked = selectedRole.permissions.includes(perm.name);
                  return (
                    <label key={perm.name} className={`flex items-center gap-3 p-2 rounded-md border ${checked ? 'bg-primary/5 border-primary' : 'border-muted'}`}>
                      <input type="checkbox" checked={checked} onChange={() => togglePermission(perm.name)} />
                      <div>
                        <div className="font-medium text-sm">{perm.display_name || perm.name}</div>
                        <div className="text-xs text-muted-foreground">{perm.name}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Permissions;



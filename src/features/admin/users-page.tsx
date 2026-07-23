import { useEffect, useState } from 'react';
import { Ban, CheckCircle2 } from 'lucide-react';
import { adminService } from '@/services';
import { useAuth } from '@/context/auth-context';
import type { User } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/format';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    adminService
      .getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (u: User, role: User['role']) => {
    setUsers((prev) => prev.map((usr) => (usr.id === u.id ? { ...usr, role } : usr)));
    try {
      await adminService.updateUser(u.id, { role });
      toast({ title: `${u.name} is now ${role}` });
    } catch {
      toast({ title: 'Failed to update role', variant: 'destructive' });
    }
  };

  const toggleStatus = async (u: User) => {
    const status = u.status === 'blocked' ? 'active' : 'blocked';
    setUsers((prev) => prev.map((usr) => (usr.id === u.id ? { ...usr, status } : usr)));
    try {
      await adminService.updateUser(u.id, { status });
      toast({ title: `${u.name} ${status === 'blocked' ? 'blocked' : 'unblocked'}` });
    } catch {
      toast({ title: 'Failed to update user', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} total</p>
      </div>

      <div className="rounded-lg border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(u.createdAt)}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role || 'customer'}
                      disabled={u.id === currentUser?.id}
                      onValueChange={(v) => handleRoleChange(u, v as User['role'])}
                    >
                      <SelectTrigger className="h-8 w-[120px] capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === 'blocked' ? 'destructive' : 'secondary'} className="capitalize">
                      {u.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={u.id === currentUser?.id}
                      onClick={() => toggleStatus(u)}
                    >
                      {u.status === 'blocked' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Ban className="h-4 w-4 mr-1.5" />
                          Block
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
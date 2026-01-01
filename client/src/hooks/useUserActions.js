import { useToast } from '../components/admin/ToastContainer';
import { adminAPI } from '../utils/api';

export const useUserActions = (users, setUsers) => {
    const { showSuccess, showError } = useToast();

    const createOptimisticUpdater = (id, field) => (newValue) => {
        const originalUsers = [...users];
        const updatedUsers = users.map(u => (u._id === id ? { ...u, [field]: newValue } : u));
        setUsers(updatedUsers);
        return () => setUsers(originalUsers);
    };

    const handleRoleChange = async (userId, newRole) => {
        const revert = createOptimisticUpdater(userId, 'role')(newRole);
        try {
            const res = await adminAPI.updateUserRole(userId, newRole);
            if (!res.success) throw new Error(res.message);
            showSuccess('User role updated');
        } catch (err) {
            revert();
            showError(err.message || 'Failed to update role');
        }
    };

    const handleStatusToggle = async (userId, newStatus) => {
        const revert = createOptimisticUpdater(userId, 'isActive')(newStatus);
        try {
            const res = await adminAPI.updateUserStatus(userId, newStatus);
            if (!res.success) throw new Error(res.message);
            showSuccess(newStatus ? 'User unblocked' : 'User blocked');
        } catch (err) {
            revert();
            showError(err.message || 'Failed to change status');
        }
    };

    const handleVerifyToggle = async (userId, newStatus) => {
        const revert = createOptimisticUpdater(userId, 'isVerified')(newStatus);
        try {
            const res = await adminAPI.updateUserVerification(userId, newStatus);
            if (!res.success) throw new Error(res.message);
            showSuccess(newStatus ? 'User verified' : 'User un-verified');
        } catch (err) {
            revert();
            showError(err.message || 'Failed to update verification');
        }
    };

    return { handleRoleChange, handleStatusToggle, handleVerifyToggle };
};

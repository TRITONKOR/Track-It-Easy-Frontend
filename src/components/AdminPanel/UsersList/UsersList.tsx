import {
    Card,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser, User } from '../../../api/user.api';
import { Button } from '../../../components/ui/Button/Button';
import { Input } from '../../../components/ui/Input/Input';
import { useAuth } from '../../../context/AuthContext';
import { useUserForm } from '../../../hooks/useUserForm';
import styles from './usersList.module.scss';

const UsersList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const form = useUserForm('user');
    const { user: currentUser } = useAuth();

    const [editValues, setEditValues] = useState({
        username: '',
        email: '',
        role: 'user',
    });
    const [editErrors, setEditErrors] = useState({
        username: '',
        email: '',
    });

    const columns = [
        { key: 'username', label: "Ім'я користувача" },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Роль' },
        { key: 'createdAt', label: 'Дата створення' },
        { key: 'actions', label: 'Дії' },
    ];

    const roles = [
        { value: 'user', label: 'Користувач' },
        { value: 'admin', label: 'Адміністратор' },
    ];

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Помилка завантаження');
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleCreateUser = async () => {
        if (!form.validate()) return;

        try {
            const newUser = await createUser(form.formData);
            setUsers((prev) => [...prev, newUser]);
            form.reset();
        } catch (err) {
            console.error('Error creating user:', err);
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditValues({
            username: user.username,
            email: user.email,
            role: user.role,
        });
        setEditErrors({ username: '', email: '' });
        onOpen();
    };

    const handleUpdateUser = async (onClose: () => void) => {
        if (!editingUser || !validateEditForm()) return;

        try {
            const updatedUser = await updateUser(editingUser.id, {
                username: editValues.username,
                email: editValues.email,
                role: editValues.role,
            });

            setUsers((prev) =>
                prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
            );
            onClose();
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const validateEditForm = () => {
        const errors = { username: '', email: '' };
        let isValid = true;

        if (!editValues.username.trim()) {
            errors.username = 'Ім’я користувача є обов’язковим';
            isValid = false;
        }

        if (!editValues.email.trim()) {
            errors.email = 'Email є обов’язковим';
            isValid = false;
        } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(editValues.email)) {
            errors.email = 'Невалідний формат email';
            isValid = false;
        }

        setEditErrors(errors);
        return isValid;
    };

    if (loading) return <Spinner />;
    if (error) return <div className={styles['error-message']}>Помилка: {error}</div>;

    return (
        <div className={styles['users-list']}>
            <h1 className={styles['title']}>Керування користувачами</h1>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={styles['modal-title']}>
                                Редагувати користувача
                            </ModalHeader>
                            <ModalBody>
                                {editingUser && (
                                    <div className={styles['modal-form']}>
                                        <Input
                                            label="Ім'я користувача"
                                            value={editValues.username}
                                            onChange={(e) =>
                                                setEditValues((prev) => ({
                                                    ...prev,
                                                    username: e.target.value,
                                                }))
                                            }
                                            validate={() => {
                                                if (editErrors.username) {
                                                    return "Ім'я користувача є обов’язковим";
                                                }
                                                return null;
                                            }}
                                        />

                                        <Input
                                            label="Email"
                                            value={editValues.email}
                                            onChange={(e) =>
                                                setEditValues((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            validate={() => {
                                                if (editErrors.email) {
                                                    return 'Email є обов’язковим';
                                                }
                                                return null;
                                            }}
                                        />

                                        <Select
                                            label="Роль"
                                            selectedKeys={[editValues.role]}
                                            onSelectionChange={(keys) =>
                                                setEditValues((prev) => ({
                                                    ...prev,
                                                    role: Array.from(keys)[0] as string,
                                                }))
                                            }
                                        >
                                            {roles.map((role) => (
                                                <SelectItem key={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className={styles['modal-actions']}>
                                <Button className={styles['cancel-button']} onClick={onClose}>
                                    Скасувати
                                </Button>
                                <Button onClick={() => handleUpdateUser(onClose)}>Зберегти</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Card title="Додати нового користувача" className={styles['add-user-card']}>
                <div className={styles['form-grid']}>
                    <Input
                        label="Ім'я користувача"
                        value={form.username}
                        onChange={(e) => form.setUsername(e.target.value)}
                        isRequired
                    />

                    <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(e) => form.setEmail(e.target.value)}
                        isRequired
                    />

                    <Input
                        label="Пароль"
                        type="password"
                        value={form.password}
                        onChange={(e) => form.setPassword(e.target.value)}
                        isRequired
                    />

                    <Select
                        label="Роль"
                        selectedKeys={[form.role]}
                        onSelectionChange={(keys) => form.setRole(Array.from(keys)[0] as string)}
                    >
                        {roles.map((role) => (
                            <SelectItem key={role.value}>{role.label}</SelectItem>
                        ))}
                    </Select>
                </div>

                <Button onClick={handleCreateUser} className={styles['add-button']}>
                    Додати користувача
                </Button>
            </Card>

            <Card>
                <Table aria-label="Таблиця користувачів" className={styles['users-table']}>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={users}>
                        {(user) => (
                            <TableRow key={user.id}>
                                {(columnKey) => {
                                    switch (columnKey) {
                                        case 'role':
                                            return (
                                                <TableCell>
                                                    <Chip
                                                        color={
                                                            user.role === 'admin'
                                                                ? 'danger'
                                                                : 'success'
                                                        }
                                                        className={
                                                            styles['role-chip'] +
                                                            ' ' +
                                                            styles[user.role]
                                                        }
                                                    >
                                                        {user.role}
                                                    </Chip>
                                                </TableCell>
                                            );
                                        case 'createdAt':
                                            return (
                                                <TableCell>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            );
                                        case 'actions':
                                            return (
                                                <TableCell className={styles['actions-cell']}>
                                                    <div className={styles['action-buttons']}>
                                                        <Button onClick={() => handleEdit(user)}>
                                                            Редагувати
                                                        </Button>
                                                        {currentUser?.id === user.id ? null : (
                                                            <Button
                                                                className={styles['delete-button']}
                                                                onClick={() =>
                                                                    handleDelete(user.id)
                                                                }
                                                            >
                                                                Видалити
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            );
                                        default:
                                            return (
                                                <TableCell>
                                                    {user[columnKey as keyof User]}
                                                </TableCell>
                                            );
                                    }
                                }}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
};

export default UsersList;

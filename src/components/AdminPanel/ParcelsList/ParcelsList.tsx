import {
    Card,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
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
import { Parcel, TrackApi } from '../../../api/TrackApi';
import { Button } from '../../../components/ui/Button/Button';
import styles from './parcelsList.module.scss';

const ParcelsList: React.FC = () => {
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const columns = [
        { key: 'trackingNumber', label: 'Трек-номер' },
        { key: 'status', label: 'Статус' },
        { key: 'factualWeight', label: 'Вага (кг)' },
        { key: 'fromLocation', label: 'Звідки' },
        { key: 'toLocation', label: 'Куди' },
        { key: 'actions', label: 'Дії' },
    ];

    const statuses = [
        { value: 'created', label: 'Створено' },
        { value: 'in_transit', label: 'В дорозі' },
        { value: 'delivered', label: 'Доставлено' },
        { value: 'returned', label: 'Повернено' },
    ];

    useEffect(() => {
        const loadParcels = async () => {
            try {
                const data = await TrackApi.getAllParcels();
                setParcels(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Помилка завантаження');
            } finally {
                setLoading(false);
            }
        };

        loadParcels();
    }, []);

    const handleViewDetails = (parcel: Parcel) => {
        setSelectedParcel(parcel);
        onOpen();
    };

    const handleDelete = async (id: string) => {
        try {
            await TrackApi.deleteParcel(id);
            setParcels((prev) => {
                const newParcels = prev.filter((parcel) => parcel.id !== id);
                return newParcels;
            });
        } catch (err) {
            console.error('Error deleting parcel:', err);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <div className={styles['error-message']}>Помилка: {error}</div>;

    return (
        <div className={styles['parcels-list']}>
            <h1 className={styles['title']}>Список посилок</h1>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={styles['modal-title']}>
                                Деталі посилки
                            </ModalHeader>
                            <ModalBody>
                                {selectedParcel && (
                                    <div className={styles['parcel-details']}>
                                        <div className={styles['detail-row']}>
                                            <span className={styles['detail-label']}>
                                                Трек-номер:
                                            </span>
                                            <span>{selectedParcel.trackingNumber}</span>
                                        </div>
                                        <div className={styles['detail-row']}>
                                            <span className={styles['detail-label']}>Статус:</span>
                                            <Chip
                                                color={
                                                    selectedParcel.status === 'Доставлено'
                                                        ? 'success'
                                                        : selectedParcel.status === 'Повернено'
                                                          ? 'danger'
                                                          : 'warning'
                                                }
                                                className={
                                                    styles['status-chip'] +
                                                    ' ' +
                                                    styles[
                                                        selectedParcel.status === 'delivered'
                                                            ? 'delivered'
                                                            : selectedParcel.status === 'returned'
                                                              ? 'returned'
                                                              : selectedParcel.status
                                                    ]
                                                }
                                            >
                                                {statuses.find(
                                                    (s) => s.value === selectedParcel.status,
                                                )?.label || selectedParcel.status}
                                            </Chip>
                                        </div>
                                        <div className={styles['detail-row']}>
                                            <span className={styles['detail-label']}>Вага:</span>
                                            <span>{selectedParcel.factualWeight} кг</span>
                                        </div>
                                        <div className={styles['detail-row']}>
                                            <span className={styles['detail-label']}>Звідки:</span>
                                            <span>{selectedParcel.fromLocation}</span>
                                        </div>
                                        <div className={styles['detail-row']}>
                                            <span className={styles['detail-label']}>Куди:</span>
                                            <span>{selectedParcel.toLocation}</span>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className={styles['modal-actions']}>
                                <Button onClick={onClose}>Закрити</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Card>
                <Table aria-label="Таблиця посилок" className={styles['parcels-table']}>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={parcels}>
                        {(parcel) => (
                            <TableRow key={parcel.id}>
                                {(columnKey) => {
                                    switch (columnKey) {
                                        case 'status':
                                            return (
                                                <TableCell>
                                                    <Chip
                                                        color={
                                                            parcel.status === 'Доставлено'
                                                                ? 'success'
                                                                : parcel.status === 'Повернено'
                                                                  ? 'danger'
                                                                  : 'warning'
                                                        }
                                                        className={
                                                            styles['status-chip'] +
                                                            ' ' +
                                                            styles[
                                                                parcel.status === 'delivered'
                                                                    ? 'delivered'
                                                                    : parcel.status === 'returned'
                                                                      ? 'returned'
                                                                      : parcel.status
                                                            ]
                                                        }
                                                    >
                                                        {statuses.find(
                                                            (s) => s.value === parcel.status,
                                                        )?.label || parcel.status}
                                                    </Chip>
                                                </TableCell>
                                            );
                                        case 'actions':
                                            return (
                                                <TableCell className={styles['actions-cell']}>
                                                    <div className={styles['action-buttons']}>
                                                        <Button
                                                            onClick={() =>
                                                                handleViewDetails(parcel)
                                                            }
                                                        >
                                                            Деталі
                                                        </Button>
                                                        <Button
                                                            className={styles['delete-button']}
                                                            onClick={() => handleDelete(parcel.id)}
                                                        >
                                                            Видалити
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            );
                                        case 'factualWeight':
                                            return <TableCell>{parcel.factualWeight} кг</TableCell>;
                                        default:
                                            return (
                                                <TableCell>
                                                    {
                                                        parcel[
                                                            columnKey as keyof Parcel
                                                        ] as React.ReactNode
                                                    }
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

export default ParcelsList;

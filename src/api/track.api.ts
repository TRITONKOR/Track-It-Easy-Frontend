import API from "../config/axios.config";

export interface TrackParcelResponse {
    success: boolean;
    data?: Parcel;
    error?: string;
}

export interface Parcel {
    id: string;
    trackingNumber: string;
    status: string;
    courier: string;
    factualWeight: number;
    fromLocation: string;
    toLocation: string;
    isFollowed: boolean;
    movementHistory: MovementHistoryEvent[];
}

export interface MovementHistoryEvent {
    statusLocation: string;
    description: string;
    timestamp: string;
}

const parcelCache: Record<
    string,
    { data: TrackParcelResponse; expires: number }
> = {};
const CACHE_TTL_MS = 3 * 60 * 1000;

export const TrackApi = {
    trackParcel: async (
        trackingNumber: string,
        userId?: string
    ): Promise<TrackParcelResponse> => {
        const cacheKey = trackingNumber + (userId ? `_${userId}` : "");
        const now = Date.now();
        if (parcelCache[cacheKey] && parcelCache[cacheKey].expires > now) {
            return parcelCache[cacheKey].data;
        }
        const response = await API.post("/track", {
            trackingNumber: trackingNumber,
            userId: userId,
        });

        if (!response.data) {
            throw new Error("Failed to fetch tracking information");
        }
        if (response.data.success) {
            parcelCache[cacheKey] = {
                data: response.data as TrackParcelResponse,
                expires: now + CACHE_TTL_MS,
            };
        }
        return response.data as TrackParcelResponse;
    },

    followParcel: async (
        trackingNumber: string,
        userId: string
    ): Promise<void> => {
        const response = await API.post("/follow-parcel", {
            trackingNumber: trackingNumber,
            userId: userId,
        });

        if (!response.status || response.status !== 201) {
            throw new Error("Failed to follow parcel");
        }
    },

    unfollowParcel: async (
        trackingNumber: string,
        userId: string
    ): Promise<void> => {
        const response = await API.post("/unfollow-parcel", {
            trackingNumber: trackingNumber,
            userId: userId,
        });

        if (!response.status || response.status !== 201) {
            throw new Error("Failed to unfollow parcel");
        }
    },

    getFollowedParcels: async (userId: string): Promise<Parcel[]> => {
        const response = await API.post("/followed-parcels", {
            userId: userId,
        });

        if (!response.data) {
            throw new Error("Failed to fetch followed parcels");
        }

        return response.data;
    },

    getAllParcels: async (): Promise<Parcel[]> => {
        const response = await API.post("/parcels", {});

        if (!response.data) {
            throw new Error("Failed to fetch all parcels");
        }

        return response.data;
    },

    deleteParcel: async (id: string): Promise<void> => {
        await API.delete(`/parcels/${id}`);
    },
};

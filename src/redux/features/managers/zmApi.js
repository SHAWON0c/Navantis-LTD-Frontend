import { baseAPI } from "../../services/baseApi";

export const zmApi = baseAPI.injectEndpoints({
	endpoints: (builder) => ({
		getMyPendingCustomers: builder.query({
			query: () => ({
				url: "/customers/pending/",
				method: "GET",
			}),
			providesTags: ["Customers"],
		}),
		getapprovedCustomersByStatus: builder.query({
			query: (status) => ({
				url: `/customers/status/${status}`,
				method: "GET",
			}),
			providesTags: ["Customers"],
		}),
		approveCustomer: builder.mutation({
			query: (customerId) => ({
				url: `/customers/approve/${customerId}`,
				method: "PUT",
			}),
			invalidatesTags: ["Customers"],
		}),
		activateCustomer: builder.mutation({
			query: (customerId) => ({
				url: `/customers/${customerId}`,
				method: "PATCH",
				body: { status: "active" },
			}),
			invalidatesTags: ["Customers"],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetMyPendingCustomersQuery,
	useGetapprovedCustomersByStatusQuery,
	useApproveCustomerMutation,
	useActivateCustomerMutation,
} = zmApi;

// Convenience hook with automatic refetch for live pending-customer updates.
export const useGetMyPendingCustomersAutoQuery = (options = {}) =>
	useGetMyPendingCustomersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		refetchOnReconnect: true,
		pollingInterval: 30000,
		...options,
	});

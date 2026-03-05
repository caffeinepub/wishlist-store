import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderItem, Product } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllProducts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  });
}

export function useGetProduct(productId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) throw new Error("No product id");
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
    staleTime: 30_000,
  });
}

export function useGetOrder(orderId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Order>({
    queryKey: ["order", orderId?.toString()],
    queryFn: async () => {
      if (!actor || orderId === null) throw new Error("No order id");
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching && orderId !== null,
    staleTime: 60_000,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      customerName,
      email,
      address,
      phone,
      items,
    }: {
      customerName: string;
      email: string;
      address: string;
      phone: string;
      items: OrderItem[];
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.placeOrder(customerName, email, address, phone, items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: bigint;
      status: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  // Include identity principal in query key so this refetches on login/logout
  const principalKey = identity?.getPrincipal().toString() ?? "anonymous";
  return useQuery<boolean>({
    queryKey: ["isAdmin", principalKey],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0, // always recheck on each identity change
  });
}

export function useClaimFirstAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.claimFirstAdmin();
    },
    onSuccess: () => {
      // Invalidate all isAdmin queries regardless of principal key
      queryClient.invalidateQueries({ queryKey: ["isAdmin"], exact: false });
    },
  });
}

export function useResetAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.resetAdmin();
    },
    onSuccess: () => {
      // Invalidate all isAdmin queries regardless of principal key
      queryClient.invalidateQueries({ queryKey: ["isAdmin"], exact: false });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderItem, Product } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
  Package,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Order } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useClaimFirstAdmin,
  useGetAllOrders,
  useIsAdmin,
  useResetAdmin,
  useUpdateOrderStatus,
} from "../hooks/useQueries";

// ── Helpers ─────────────────────────────────────────────────────────

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatSGD(cents: bigint): string {
  const num = Number(cents) / 100;
  return `SGD $${num.toFixed(2)}`;
}

function formatOrderId(id: bigint): string {
  return `#${id.toString().padStart(3, "0")}`;
}

type Status = "Processing" | "Shipped" | "Delivered" | "Pending" | string;

function StatusBadge({ status }: { status: Status }) {
  const map: Record<
    string,
    { dot: string; bg: string; text: string; label: string }
  > = {
    Processing: {
      dot: "bg-amber-500",
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-700",
      label: "Processing",
    },
    Shipped: {
      dot: "bg-blue-500",
      bg: "bg-blue-50 border-blue-200",
      text: "text-blue-700",
      label: "Shipped",
    },
    Delivered: {
      dot: "bg-emerald-500",
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      label: "Delivered",
    },
    Pending: {
      dot: "bg-stone-400",
      bg: "bg-stone-50 border-stone-200",
      text: "text-stone-600",
      label: "Pending",
    },
  };
  const style = map[status] ?? map.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium border ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      {style.label}
    </span>
  );
}

// ── Per-Order Status Update ──────────────────────────────────────────

function OrderStatusControl({ order }: { order: Order }) {
  const [selected, setSelected] = useState(order.status);
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus();

  const isDirty = selected !== order.status;

  const handleSave = async () => {
    try {
      await updateStatus({ orderId: order.id, status: selected });
      toast.success(`Order ${formatOrderId(order.id)} updated to ${selected}`);
    } catch {
      toast.error("Failed to update order status");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger
          data-ocid="admin.order.select"
          className="font-body text-xs h-8 w-36 rounded-none border-border"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending" className="font-body text-xs">
            Pending
          </SelectItem>
          <SelectItem value="Processing" className="font-body text-xs">
            Processing
          </SelectItem>
          <SelectItem value="Shipped" className="font-body text-xs">
            Shipped
          </SelectItem>
          <SelectItem value="Delivered" className="font-body text-xs">
            Delivered
          </SelectItem>
        </SelectContent>
      </Select>
      {isDirty && (
        <Button
          data-ocid="admin.order.save_button"
          size="sm"
          disabled={isPending}
          onClick={handleSave}
          className="h-8 px-3 font-body text-xs tracking-widest uppercase rounded-none bg-foreground text-background hover:opacity-80"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : "Save"}
        </Button>
      )}
    </div>
  );
}

// ── Order Card ───────────────────────────────────────────────────────

function OrderCard({ order, index }: { order: Order; index: number }) {
  return (
    <div
      data-ocid={`admin.order.item.${index}`}
      className="bg-card border border-border p-6 space-y-5"
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="font-display text-lg font-semibold text-foreground">
            {formatOrderId(order.id)}
          </span>
          <StatusBadge status={order.status} />
        </div>
        <span className="font-body text-xs text-muted-foreground tabular-nums">
          {formatTimestamp(order.createdAt)}
        </span>
      </div>

      <Separator />

      {/* Customer info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-0.5">
          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
            Customer
          </p>
          <p className="font-body text-sm text-foreground font-medium">
            {order.customerName}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
            Email
          </p>
          <p className="font-body text-sm text-foreground truncate">
            {order.email}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
            Phone
          </p>
          <p className="font-body text-sm text-foreground">{order.phone}</p>
        </div>
        <div className="space-y-0.5">
          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
            Shipping Address
          </p>
          <p className="font-body text-sm text-foreground leading-snug">
            {order.address}
          </p>
        </div>
      </div>

      <Separator />

      {/* Items */}
      <div className="space-y-2">
        <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
          Items
        </p>
        <div className="space-y-1.5">
          {order.items.map((item, i) => (
            <div
              key={`${item.productId.toString()}-${item.size}-${i}`}
              className="flex items-center justify-between"
            >
              <span className="font-body text-sm text-foreground">
                Product #{item.productId.toString()} — Size:{" "}
                <span className="font-medium">{item.size}</span> ×{" "}
                {item.quantity.toString()}
              </span>
              <span className="font-body text-sm text-muted-foreground tabular-nums">
                {formatSGD(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Footer: total + status update */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
            Order Total
          </p>
          <p className="font-body text-base font-semibold text-foreground">
            {formatSGD(order.totalAmount)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
            Update Status
          </p>
          <OrderStatusControl order={order} />
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-card border border-border p-5 space-y-1">
      <p className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-2xl font-semibold text-foreground">
        {value}
      </p>
      {sub && <p className="font-body text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── Login Gate ───────────────────────────────────────────────────────

function LoginGate() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="font-display text-3xl font-semibold text-foreground">
            Wishlist
          </p>
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
            Admin Portal
          </p>
        </div>

        <div className="border border-border bg-card p-8 space-y-6">
          <ShieldCheck
            size={32}
            strokeWidth={1}
            className="mx-auto text-muted-foreground"
          />
          <div className="space-y-1.5">
            <p className="font-body text-sm font-medium text-foreground">
              Admin access required
            </p>
            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              Sign in with your Internet Identity to access the order dashboard.
            </p>
          </div>
          <Button
            data-ocid="admin.login_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full font-body text-xs tracking-widest uppercase h-11 bg-foreground text-background hover:opacity-80 rounded-none disabled:opacity-50"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={13} className="mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>

        <p className="font-body text-xs text-muted-foreground">
          Only authorized administrators can access this dashboard.
        </p>
      </div>
    </div>
  );
}

// ── First Admin Setup ────────────────────────────────────────────────

function FirstAdminSetup({
  onClaimSuccess,
}: {
  onClaimSuccess: () => void;
}) {
  const { identity, clear } = useInternetIdentity();
  const { mutateAsync: claimAdmin, isPending: isClaiming } =
    useClaimFirstAdmin();
  const { mutateAsync: resetAdmin, isPending: isResetting } = useResetAdmin();

  const [view, setView] = useState<"claim" | "reset_confirm">("claim");

  const isWorking = isClaiming || isResetting;

  const handleSignOut = () => {
    const key = `forcedAdmin_${identity?.getPrincipal().toString()}`;
    localStorage.removeItem(key);
    clear();
  };

  const handleClaim = async () => {
    try {
      await claimAdmin();
      toast.success("Admin access claimed successfully! Opening dashboard…");
      onClaimSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("exists")
      ) {
        toast.error(
          "Admin access has already been claimed by another account.",
        );
      } else {
        toast.error(msg || "Failed to claim admin access.");
      }
    }
  };

  const handleResetAndClaim = async () => {
    try {
      await resetAdmin();
      await claimAdmin();
      toast.success("Admin access reset and claimed. Welcome!");
      onClaimSuccess();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Failed to reset admin access.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div
        data-ocid="admin.first_setup_panel"
        className="max-w-sm w-full text-center space-y-8"
      >
        <div className="space-y-2">
          <p className="font-display text-3xl font-semibold text-foreground">
            Wishlist
          </p>
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
            Admin Setup
          </p>
        </div>

        {view === "claim" ? (
          <div className="border border-border bg-card p-8 space-y-6">
            <ShieldAlert
              size={32}
              strokeWidth={1}
              className="mx-auto text-muted-foreground"
            />
            <div className="space-y-2">
              <p className="font-body text-sm font-medium text-foreground">
                Claim Admin Access
              </p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                If you are the store owner, you can claim admin access. This
                only works if no admin has been set up yet.
              </p>
            </div>
            <Button
              data-ocid="admin.claim_admin_button"
              disabled={isClaiming}
              onClick={handleClaim}
              className="w-full font-body text-xs tracking-widest uppercase h-11 bg-foreground text-background hover:opacity-80 rounded-none disabled:opacity-50"
            >
              {isClaiming ? (
                <>
                  <Loader2 size={13} className="mr-2 animate-spin" />
                  Claiming…
                </>
              ) : (
                "Claim Admin Access"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full font-body text-xs tracking-widest uppercase h-10 rounded-none"
            >
              Sign Out
            </Button>
            <button
              type="button"
              onClick={() => setView("reset_confirm")}
              className="font-body text-xs text-muted-foreground underline hover:text-foreground transition-colors"
            >
              Already have access issues? Reset admin
            </button>
          </div>
        ) : (
          <div className="border border-border bg-card p-8 space-y-6">
            <ShieldAlert
              size={32}
              strokeWidth={1}
              className="mx-auto text-red-500"
            />
            <div className="space-y-2">
              <p className="font-body text-sm font-medium text-foreground">
                Reset Admin Access
              </p>
              <div className="bg-red-50 border border-red-200 p-4 text-left space-y-1.5">
                <p className="font-body text-xs font-medium text-red-700">
                  Warning
                </p>
                <p className="font-body text-xs text-red-600 leading-relaxed">
                  This will remove all existing admin access. You will be able
                  to claim admin immediately after.
                </p>
              </div>
            </div>
            <Button
              data-ocid="admin.reset_confirm_button"
              disabled={isWorking}
              onClick={handleResetAndClaim}
              className="w-full font-body text-xs tracking-widest uppercase h-11 bg-red-600 text-white hover:bg-red-700 rounded-none disabled:opacity-50"
            >
              {isWorking ? (
                <>
                  <Loader2 size={13} className="mr-2 animate-spin" />
                  Resetting…
                </>
              ) : (
                "Reset & Reclaim Admin"
              )}
            </Button>
            <Button
              data-ocid="admin.reset_cancel_button"
              variant="outline"
              disabled={isWorking}
              onClick={() => setView("claim")}
              className="w-full font-body text-xs tracking-widest uppercase h-10 rounded-none"
            >
              Cancel
            </Button>
          </div>
        )}

        <p className="font-body text-xs text-muted-foreground">
          {view === "claim"
            ? "If an admin already exists, contact the store owner for access."
            : "Only reset admin if you have been locked out of your account."}
        </p>
      </div>
    </div>
  );
}

// ── Dashboard Loading Skeleton ───────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div data-ocid="admin.loading_state" className="min-h-screen bg-background">
      <div className="border-b border-border px-6 lg:px-12 h-14 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border p-5 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-14" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Constants ────────────────────────────────────────────────────────

const PAGE_SIZE = 25;
const STATUS_FILTERS = ["All", "Pending", "Processing", "Shipped", "Delivered"];

// ── Main Dashboard ───────────────────────────────────────────────────

function Dashboard() {
  const { identity, clear } = useInternetIdentity();
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();

  const handleSignOut = () => {
    const key = `forcedAdmin_${identity?.getPrincipal().toString()}`;
    localStorage.removeItem(key);
    clear();
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  // Sort: most recent first (highest id first)
  const sorted = [...orders].sort((a, b) =>
    a.id > b.id ? -1 : a.id < b.id ? 1 : 0,
  );

  // Filter
  const filtered = sorted.filter((order) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.customerName.toLowerCase().includes(q) ||
      order.email.toLowerCase().includes(q) ||
      formatOrderId(order.id).toLowerCase().includes(q) ||
      order.id.toString().includes(q);
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.totalAmount,
    BigInt(0),
  );
  const processingCount = orders.filter(
    (o) => o.status === "Processing",
  ).length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package
              size={16}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
            <span className="font-display text-base font-semibold text-foreground">
              Wishlist Admin
            </span>
            <span className="hidden sm:inline font-body text-xs text-muted-foreground">
              — Order Dashboard
            </span>
          </div>
          <Button
            data-ocid="admin.logout_button"
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="font-body text-xs text-muted-foreground hover:text-foreground gap-1.5 rounded-none"
          >
            <LogOut size={13} strokeWidth={1.5} />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">
        {/* Page title */}
        <div className="space-y-1">
          <p className="font-body text-xs tracking-widest uppercase text-muted-foreground">
            Admin Dashboard
          </p>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            All Orders
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Orders" value={orders.length} sub="All time" />
          <StatCard
            label="Total Revenue"
            value={formatSGD(totalRevenue)}
            sub="Cash on Delivery"
          />
          <StatCard
            label="Processing"
            value={processingCount}
            sub="Awaiting shipment"
          />
          <StatCard label="Shipped" value={shippedCount} sub="In transit" />
        </div>

        {/* Search + Filter */}
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              data-ocid="admin.search_input"
              placeholder="Search by name, email, or order ID…"
              value={search}
              onChange={handleSearchChange}
              className="pl-9 font-body text-sm rounded-none h-10 border-border"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 flex-wrap" role="tablist">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                type="button"
                role="tab"
                data-ocid="admin.filter.tab"
                aria-selected={statusFilter === status}
                onClick={() => handleFilterChange(status)}
                className={`font-body text-xs tracking-widest uppercase px-3 py-1.5 transition-colors border ${
                  statusFilter === status
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Orders list */}
        {ordersLoading ? (
          <div data-ocid="admin.orders.loading_state" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-10 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="admin.orders.empty_state"
            className="py-20 text-center space-y-3 border border-dashed border-border"
          >
            <Package
              size={32}
              strokeWidth={1}
              className="mx-auto text-muted-foreground"
            />
            <p className="font-body text-sm text-muted-foreground">
              {search || statusFilter !== "All"
                ? "No orders match your search."
                : "No orders yet."}
            </p>
            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="font-body text-xs text-muted-foreground underline hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Results count */}
            <p className="font-body text-xs text-muted-foreground">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} order{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Order cards */}
            <div className="space-y-4">
              {paginated.map((order, i) => (
                <OrderCard
                  key={order.id.toString()}
                  order={order}
                  index={(safePage - 1) * PAGE_SIZE + i + 1}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <Button
                  data-ocid="admin.pagination_prev"
                  variant="outline"
                  size="sm"
                  disabled={safePage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="font-body text-xs rounded-none gap-1.5 disabled:opacity-40"
                >
                  <ChevronLeft size={13} />
                  Previous
                </Button>
                <span className="font-body text-xs text-muted-foreground tabular-nums">
                  Page {safePage} of {totalPages}
                </span>
                <Button
                  data-ocid="admin.pagination_next"
                  variant="outline"
                  size="sm"
                  disabled={safePage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="font-body text-xs rounded-none gap-1.5 disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={13} />
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Wishlist Admin — Internal use only
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Page Entry ───────────────────────────────────────────────────────

export default function AdminPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const [forcedAdmin, setForcedAdmin] = useState(false);

  // Restore forcedAdmin from localStorage when identity is available
  useEffect(() => {
    if (!identity) return;
    const key = `forcedAdmin_${identity.getPrincipal().toString()}`;
    if (localStorage.getItem(key) === "true") {
      setForcedAdmin(true);
    }
  }, [identity]);

  const onClaimSuccess = () => {
    if (!identity) return;
    const key = `forcedAdmin_${identity.getPrincipal().toString()}`;
    localStorage.setItem(key, "true");
    setForcedAdmin(true);
  };

  // Still loading auth state
  if (isInitializing) {
    return <DashboardSkeleton />;
  }

  // Not logged in
  if (!identity) {
    return <LoginGate />;
  }

  // Logged in but admin check in progress (only block if not already forced)
  if (adminLoading && !forcedAdmin) {
    return <DashboardSkeleton />;
  }

  // Admin confirmed by backend OR forced after successful claim
  if (isAdmin || forcedAdmin) {
    return <Dashboard />;
  }

  // Logged in but not admin — show first-time setup
  return <FirstAdminSetup onClaimSuccess={onClaimSuccess} />;
}

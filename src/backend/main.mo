import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import OrderUtil "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Mixin authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    sizes : [Text];
    imageUrl : Text;
    description : Text;
  };

  public type OrderItem = {
    productId : Nat;
    size : Text;
    quantity : Nat;
    price : Nat;
  };

  public type Order = {
    id : Nat;
    customerName : Text;
    email : Text;
    address : Text;
    phone : Text;
    items : [OrderItem];
    totalAmount : Nat;
    paymentMethod : Text;
    status : Text;
    createdAt : Int;
    placedBy : Principal;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : OrderUtil.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  module Order {
    public func compare(order1 : Order, order2 : Order) : OrderUtil.Order {
      Nat.compare(order1.id, order2.id);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let products = Map.empty<Nat, Product>();
  let orders = Map.empty<Nat, Order>();
  var nextProductId = 8;
  var nextOrderId = 1;
  var adminClaimed = false;

  // Hardcoded 7 seed products (do not touch these)
  let seedProducts : [Product] = [
    {
      id = 1;
      name = "Wrap Tie Midi Skirt";
      category = "Skirts";
      price = 349900;
      sizes = ["Small", "Medium", "Large"];
      imageUrl = "/assets/uploads/37d8a4c6025d30a6af840bbcc01c255a-1.jpg";
      description = "Dark charcoal wrap skirt with contrast tie detailing and pleated lower panel. Architectural and refined.";
    },
    {
      id = 2;
      name = "Draped Wide-Leg Trousers";
      category = "Pants";
      price = 349900;
      sizes = ["Small", "Medium", "Large"];
      imageUrl = "/assets/uploads/0b4a647c5c0d72c3c555e4c453eaecf1-1-2.jpg";
      description = "Architectural wide-leg silhouette with a dramatic draped front panel. Elevated wardrobe staple.";
    },
    {
      id = 3;
      name = "Plaid-Layered Baggy Jeans";
      category = "Pants";
      price = 349900;
      sizes = ["Small", "Medium", "Large"];
      imageUrl = "/assets/uploads/728ed3a7056f6d549e4713cb5a9fdc99-3.jpg";
      description = "Oversized denim with a deconstructed plaid overlay. Bold, editorial statement piece.";
    },
    {
      id = 4;
      name = "Plaid-Draped Balloon Pants";
      category = "Pants";
      price = 349900;
      sizes = ["Small", "Medium", "Large"];
      imageUrl = "/assets/uploads/c06bd491e629cc58123c67f059c56864-1-4.jpg";
      description = "Black balloon-leg denim with an oversized draped plaid layer. Dramatic silhouette, maximum impact.";
    },
    {
      id = 5;
      name = "Chinese Knot Button Shirt";
      category = "Shirts";
      price = 199900;
      sizes = ["Small", "Medium", "Large"];
      imageUrl = "/assets/uploads/cf3429abf00a319ded6cafd12786af20-5.jpg";
      description = "Natural linen shirt with traditional Chinese frog knot closures. Minimalist heritage meets modern ease.";
    },
    {
      id = 6;
      name = "Cat Embroidery Plaid Shirt";
      category = "Shirts";
      price = 199900;
      sizes = ["Small", "Medium", "Large"];
      imageUrl = "/assets/uploads/e69659b53c59b7ce39b555473713f573-1-6.jpg";
      description = "Oversized plaid shirt with playful cat embroidery and a detachable tie. Casual charm.";
    },
    {
      id = 7;
      name = "Cat Print Denim Skirt";
      category = "Skirts";
      price = 349900;
      sizes = ["Small", "Medium", "Large"];
      imageUrl = "/assets/uploads/17c0fa49f6b4bb9827425433e5b4caf0-1-7.jpg";
      description = "Asymmetric wrap denim skirt with oversized cat graphic print. A statement piece for any wardrobe.";
    },
  ];

  // Only used for migrations, not during actor initialization
  public query ({ caller }) func getSeedProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized");
    };
    seedProducts;
  };

  // **********
  // User Profile Management
  // **********

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // **********
  // Product Management
  // **********

  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProduct(productId : Nat) : async Product {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) { product };
    };
  };

  public shared ({ caller }) func addProduct(
    name : Text,
    category : Text,
    price : Nat,
    sizes : [Text],
    imageUrl : Text,
    description : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let productId = nextProductId;
    let product : Product = {
      id = productId;
      name;
      category;
      price;
      sizes;
      imageUrl;
      description;
    };
    products.add(productId, product);
    nextProductId += 1;
    productId;
  };

  public shared ({ caller }) func updateProduct(
    productId : Nat,
    name : Text,
    category : Text,
    price : Nat,
    sizes : [Text],
    imageUrl : Text,
    description : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?_product) {
        let updatedProduct : Product = {
          id = productId;
          name;
          category;
          price;
          sizes;
          imageUrl;
          description;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  // **********
  // Order Management
  // **********

  public shared ({ caller }) func placeOrder(
    customerName : Text,
    email : Text,
    address : Text,
    phone : Text,
    items : [OrderItem],
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let totalAmount = items.foldLeft(0, func(acc, item) { acc + (item.price * item.quantity) });
    let orderId = nextOrderId;
    let order : Order = {
      id = orderId;
      customerName;
      email;
      address;
      phone;
      items;
      totalAmount;
      paymentMethod = "Cash on Delivery";
      status = "Pending";
      createdAt = Time.now();
      placedBy = caller;
    };
    orders.add(orderId, order);
    nextOrderId += 1;
    orderId;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    orders.values().toArray().sort();
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        if (caller != order.placedBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order does not exist") };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  // **********
  // First Admin Bootstrapping
  // **********

  public shared ({ caller }) func claimFirstAdmin() : async () {
    if (adminClaimed) {
      Runtime.trap("An admin already exists");
    };
    adminClaimed := true;
  };

  public shared ({ caller }) func resetAdmin() : async () {
    adminClaimed := false;
  };
};

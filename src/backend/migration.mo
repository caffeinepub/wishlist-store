import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type UserProfile = {
    name : Text;
  };

  type Product = {
    id : Nat;
    name : Text;
    category : Text;
    price : Nat;
    sizes : [Text];
    imageUrl : Text;
    description : Text;
  };

  type OrderItem = {
    productId : Nat;
    size : Text;
    quantity : Nat;
    price : Nat;
  };

  type Order = {
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

  type StableActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    products : Map.Map<Nat, Product>;
    orders : Map.Map<Nat, Order>;
    nextProductId : Nat;
    nextOrderId : Nat;
  };

  public func run(state : StableActor) : StableActor {
    state;
  };
};

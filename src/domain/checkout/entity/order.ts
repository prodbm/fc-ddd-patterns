import OrderItem from "./order_item";
export default class Order {

  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0);
  }

  addItem(orderItem2: OrderItem) {

    if (this._items == null) {
      this._items = [];
    }

    if (this._items.some((item) => item.id === orderItem2.id)) {
      this._items = this._items.map((item) => {
        if (item.id === orderItem2.id) {
          return new OrderItem(
            item.id,
            orderItem2.name,
            orderItem2.price,
            orderItem2.productId,
            orderItem2.quantity
          );
        }
        return item;
      });
    }
    else {
      this._items.push(orderItem2);
    }
    this._total = this.total();
    this.validate();

  }
}

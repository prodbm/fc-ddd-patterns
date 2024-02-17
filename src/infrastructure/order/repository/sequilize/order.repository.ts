import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    const sequelize = OrderModel.sequelize;

    try {
      await sequelize.transaction(async (t) => {

        await OrderModel.update(
          {
            customer_id: entity.customerId,
            total: entity.total()
          },
          {
            where: {
              id: entity.id,
            }
            ,
            transaction: t
          }
        );

        await OrderItemModel.destroy({ where: { order_id: entity.id }, transaction: t });

        await OrderItemModel.bulkCreate(entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id
        })),
          { transaction: t }
        );
      });
    } catch (error) {
      console.log(error);
      console.error('Error occurred during transaction', error);
    }


  }
  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });

    const orderItems = orderModel.items.map((item) =>
      new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity
      ));

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"] });

    const orders = orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map((item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity
        ));
      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });

    return orders;
  }

}

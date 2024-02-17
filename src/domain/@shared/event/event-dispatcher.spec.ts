import CustomerAddressChangedEvent from "../../customer/event/customer-address-changer.events";
import CustomerCreatedEvent from "../../customer/event/customer-creater.events";
import Log1WHenCustomerIsCreatedHandler from "../../customer/event/handler/log-1-when-customer-is-created.handler";
import Log2WHenCustomerIsCreatedHandler from "../../customer/event/handler/log-2-when-customer-is-created.handler";
import LogWhenCustomerAddressIsChangedHandler from "../../customer/event/handler/log-when-customer-address-is-changed.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});

it("should notify all envent handlers after create a customer", () => {

  const eventDispatcher = new EventDispatcher();
  const eventHandler1 = new Log1WHenCustomerIsCreatedHandler();
  const eventHandler2 = new Log2WHenCustomerIsCreatedHandler();

  const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
  const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

  eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
  eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

  const customerCreatedEvent = new CustomerCreatedEvent({
    name: "Customer 1",
    email: "email 1"
  });

  eventDispatcher.notify(customerCreatedEvent);

  expect(spyEventHandler1).toHaveBeenCalled();
  expect(spyEventHandler2).toHaveBeenCalled();

});

it("should notify event handlers when customer address is changed", () => {
  const eventDispatcher = new EventDispatcher();
  const eventHandler = new LogWhenCustomerAddressIsChangedHandler();
  const spyEventHandler = jest.spyOn(eventHandler, "handle");

  eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

  const customerAddressChangedEvent = new CustomerAddressChangedEvent({
    id: "123",
    name : "Customer 1",	
    street: "Street 1"    
  });

  eventDispatcher.notify(customerAddressChangedEvent);

  expect(spyEventHandler).toHaveBeenCalled();
});

import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changer.events";


export default class LogWhenCustomerAddressIsChangedHandler
    implements EventHandlerInterface<CustomerAddressChangedEvent>
{
    handle(event: CustomerAddressChangedEvent): void {
        const { id, name, street } = event.eventData;
        console.log(`"Endereço do cliente: ${id}, ${name} alterado para: ${street}"`);
    }
}


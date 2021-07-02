import Icon from '../components/icon/icon';
import { OrderStateEnum } from './order-state.enum';

export default function OrderStateBadge({ orderState }) {
  const stateId = orderState.id;
  const stateMap = OrderStateEnum;
  return stateId === stateMap.Processing ? (
    <span className="badge badge-secondary my-auto ml-auto mr-2 shadow">
      <Icon dataIcon="fa:refresh" classes="my-auto mx-1" />
      Processing
    </span>
  ) : stateId === stateMap.Shipped ? (
    <span className="badge badge-primary my-auto ml-auto mr-2 shadow">
      <Icon dataIcon="fa:truck" classes="my-auto mx-1" />
      Shipped
    </span>
  ) : stateId === stateMap.Delivered ? (
    <span className="badge badge-success my-auto ml-auto mr-2 shadow">
      <Icon dataIcon="fa:check" classes="my-auto mx-1" />
      Delivered
    </span>
  ) : (
    <span className="badge badge-danger my-auto ml-auto mr-2 shadow">
      <Icon dataIcon="fa:times" classes="my-auto mx-1" />
      Cancelled
    </span>
  );
}

import Icon from '../../components/icon/icon';

export default function RoleBadge({ roles }) {
  return roles.find((r) => r.name === 'admin') ? (
    <div className="badge bg-dark m-1 p-2">
      <Icon dataIcon="fa:shield" /> ADMIN
    </div>
  ) : roles.find((r) => r.name === 'moderator') ? (
    <div className="badge bg-orange m-1 p-2">
      <Icon dataIcon="whh-hammeralt" /> MODERATOR
    </div>
  ) : roles.find((r) => r.name === 'editor') ? (
    <div className="badge bg-blue m-1 p-2">
      <Icon dataIcon="fa:pencil" /> EDITOR
    </div>
  ) : (
    ''
  );
}

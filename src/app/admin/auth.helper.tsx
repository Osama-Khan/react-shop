import { Redirect } from 'react-router';
import { homeUrl } from '../routes';
import LoadingSpinner from '../components/loading/loading-spinner';

export default function authorize(context: any) {
  if (context.state.user.restoringState) {
    return <LoadingSpinner />;
  }
  if (
    !context.state.user.token ||
    !context.state.user.roles.find((r: any) => r.name === 'admin')
  ) {
    context.services.uiService.toast(
      'You need to be logged in as admin to access admin panel.',
    );
    return <Redirect to={homeUrl} />;
  }
}

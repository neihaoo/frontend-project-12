import { Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <Image
        src="https://cdn2.hexlet.io/assets/error-pages/404-4b6ef16aba4c494d8101c104236304e640683fa9abdb3dd7a46cab7ad05d46e9.svg"
        alt={t('notFound.title')}
        fluid
      />
      <h1 className="h4 text-muted">{t('notFound.title')}</h1>
      <p className="text-muted">
        {t('notFound.message')}
        {' '}
        <a href="/">{t('notFound.linkText')}</a>
      </p>
    </div>
  );
};

export default ErrorPage;

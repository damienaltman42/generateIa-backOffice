import { App } from 'antd';

export const useNotification = () => {
  const { notification, message } = App.useApp();

  const showSuccess = (title: string, description?: string) => {
    notification.success({
      message: title,
      description,
      placement: 'topRight',
      duration: 4,
    });
  };

  const showError = (title: string, description?: string) => {
    notification.error({
      message: title,
      description,
      placement: 'topRight',
      duration: 6,
    });
  };

  const showInfo = (title: string, description?: string) => {
    notification.info({
      message: title,
      description,
      placement: 'topRight',
      duration: 4,
    });
  };

  const showWarning = (title: string, description?: string) => {
    notification.warning({
      message: title,
      description,
      placement: 'topRight',
      duration: 5,
    });
  };

  const showMessage = {
    success: (content: string) => message.success(content),
    error: (content: string) => message.error(content),
    info: (content: string) => message.info(content),
    warning: (content: string) => message.warning(content),
  };

  return {
    notification: {
      success: showSuccess,
      error: showError,
      info: showInfo,
      warning: showWarning,
    },
    message: showMessage,
  };
}; 
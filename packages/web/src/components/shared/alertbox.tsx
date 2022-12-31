import { Alert } from "react-bootstrap";

export enum AlertBoxLevel {
  Info,
  Warning,
  Error,
}

export interface AlertBoxProps {
  isVisible: boolean;
  level: AlertBoxLevel;
  message: string;
  hideAlert: () => void;
}

const alertLeveltoVariant = (alertLevel: AlertBoxLevel): string => {
  // Convert component warning level to modal variant for styling
  let variant: string;

  switch (alertLevel) {
    case AlertBoxLevel.Info:
      variant = "info";
      break;
    case AlertBoxLevel.Warning:
      variant = "warning";
      break;
    case AlertBoxLevel.Error:
      variant = "danger";
      break;
    default:
      variant = "warning";
  }

  return variant;
};

const AlertBox: React.FC<AlertBoxProps> = ({
  isVisible,
  level,
  message,
  hideAlert,
}: AlertBoxProps) => {
  // Alert modal

  return (
    <Alert
      key={alertLeveltoVariant(level)}
      variant={alertLeveltoVariant(level)}
      onClose={() => hideAlert()}
      show={isVisible}
      dismissible
    >
      {message}
    </Alert>
  );
};

export default AlertBox;

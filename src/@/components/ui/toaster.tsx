import { useToast } from "../../../hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../ui/toast"

interface ToasterProps{
  tostCloseStyle:string;
  toastExtraStlye?:string;
}

export function Toaster({tostCloseStyle,toastExtraStlye}:ToasterProps) {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}  >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-base font-oswald">{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={tostCloseStyle?tostCloseStyle:""} />
          </Toast>
        )
      })}
      <ToastViewport className={toastExtraStlye?toastExtraStlye:""} />
    </ToastProvider>
  )
}

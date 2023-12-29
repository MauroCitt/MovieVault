import  { Toaster, toast } from 'sonner';

const notifyExpired = () => toast.error('Magic Link expired', {style: {
    background: 'white', padding: '16px',
  }, className: 'custom-toast',
  duration: 5000,
  });

  export default notifyExpired;
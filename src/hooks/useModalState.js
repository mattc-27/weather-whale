
export function useModalState(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  };
}

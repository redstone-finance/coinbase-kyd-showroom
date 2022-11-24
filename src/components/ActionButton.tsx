interface Props {
  action: () => void;
  text: string;
  outlined?: boolean;
}

export const ActionButton = ({ action, text, outlined = false }: Props) => (
  <button
    className={`py-3 px-8 rounded-full text-xl ${outlined 
      ? "bg-white hover:opacity-75 text-redstone border border-redstone" 
      : "bg-redstone hover:opacity-75 text-white"
    }`}
    onClick={action}
  >
    {text}
  </button>
);

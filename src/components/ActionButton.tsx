interface Props {
  action: () => void;
  text: string;
}

export const ActionButton = ({ action, text }: Props) => (
  <button
    className="bg-redstone hover:opacity-75 text-white py-3 px-8 rounded-full text-xl"
    onClick={action}
  >
    {text}
  </button>
);

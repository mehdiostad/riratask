import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/components/Board"), {
  ssr: false,
});
const page = () => {
  return (
    <div className="bg-black text-white">
      <Board />
    </div>
  );
};

export default page;

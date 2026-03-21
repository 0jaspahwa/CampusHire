export default function PageHeader({ title, description }: any) {

  return (
    <div className="mb-10">

      <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
        {title}
      </h1>

      <p className="text-[#888888] max-w-xl text-sm">
        {description}
      </p>

    </div>
  );
}
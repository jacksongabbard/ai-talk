type HydrationBilgeProps = any;

const HydrationBilge: React.FC<HydrationBilgeProps> = ({ props }) => {
  return (
    <>
      <div id="hydration-bilge" data-hydration-state={JSON.stringify(props)} />
      <script src="/static/hydrate.js"></script>
    </>
  );
};

export default HydrationBilge;

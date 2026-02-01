import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-medium mb-6 text-foreground">
          About FurniHome
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Crafting comfort and style for modern homes since 2010. We believe
          furniture should be beautiful, functional, and built to last.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=1000&fit=crop"
            alt="Our Workshop"
            className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-display font-medium mb-4 text-foreground">
            Our Story
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            It started with a simple idea: good design should be accessible.
            Found in a small garage workshop, FurniHome has grown into a beloved
            brand known for quality craftsmanship and transparent pricing.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We partner directly with artisans to cut out the middlemen, bringing
            you premium furniture at honest prices. Every piece is carefully
            inspected to ensure it meets our high standards of durability and
            comfort.
          </p>
        </motion.div>
      </div>

      <div className="bg-secondary/30 rounded-3xl p-12 text-center my-20">
        <h2 className="text-3xl font-display font-medium mb-8 text-foreground">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🌿
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Sustainability
            </h3>
            <p className="text-sm text-muted-foreground">
              Responsibly sourced timber and eco-friendly fabrics.
            </p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✨
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Quality
            </h3>
            <p className="text-sm text-muted-foreground">
              Built to withstand the test of time and everyday life.
            </p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🤝
            </div>
            <h3 className="text-lg font-medium mb-2 text-foreground">
              Community
            </h3>
            <p className="text-sm text-muted-foreground">
              Supporting local artisans and ethical manufacturing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

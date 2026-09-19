import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const stripLayoutTransition = () => ({
  postcssPlugin: 'strip-layout-transition',
  Rule(rule) {
    if (rule.selector && rule.selector.includes('transition-\\[width\\]')) {
      rule.remove();
    }
  },
  Declaration(decl) {
    if (decl.prop === 'transition-property' && decl.value === 'width') {
      decl.remove();
    }
  },
});
stripLayoutTransition.postcss = true;

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    stripLayoutTransition(),
  ],
};

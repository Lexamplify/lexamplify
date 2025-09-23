import StarterKit from '@tiptap/starter-kit';
import { Node, Extension } from '@tiptap/core';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';

// Define a type for Tiptap extensions for better type safety
type TiptapExtension = Extension | Node;

/**
 * A custom extension to explicitly handle text-align parsing from inline styles.
 * This is more reliable than the default TextAlign extension for this use case.
 */
export const CustomTextAlign = Extension.create({
  name: 'textAlign',

  addOptions() {
    return {
      types: ['heading', 'paragraph', 'listItem'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            // This is the part that reads the style from the HTML element
            parseHTML: element => element.style.textAlign || this.options.defaultAlignment,
            // This is the part that writes the style back to the HTML element
            renderHTML: attributes => {
              if (attributes.textAlign && attributes.textAlign !== this.options.defaultAlignment) {
                return { style: `text-align: ${attributes.textAlign}` };
              }
              return {};
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setTextAlign: (alignment: string) => ({ commands }) => {
        if (!this.options.alignments.includes(alignment)) {
          return false;
        }
        return this.options.types.every(type => commands.updateAttributes(type, { textAlign: alignment }));
      },
      unsetTextAlign: () => ({ commands }) => {
        return this.options.types.every(type => commands.resetAttributes(type, 'textAlign'));
      },
    };
  },
});


/**
 * Custom Tiptap extension to parse and render the `line-height` style.
 */
export const LineHeight: Node = Node.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.lineHeight || null,
            renderHTML: (attributes: { lineHeight?: string }) => {
              if (!attributes.lineHeight) {
                return {};
              }
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },
});

/**
 * An array of all Tiptap extensions required for parsing the DOCX content.
 */
export const parsingExtensions: TiptapExtension[] = [
  StarterKit.configure({
    // You can configure or disable default extensions here if needed
  }),
  // ✅ We are now using our more robust custom extension
  CustomTextAlign,
  TextStyle,
  FontFamily,
  LineHeight,
];


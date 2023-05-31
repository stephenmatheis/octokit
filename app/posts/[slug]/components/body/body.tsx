import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';

// import remarkGfm from 'remark-gfm'
// import rehypeSlug from 'rehype-slug'
// import rehypeAutolinkHeadings from 'rehype-autolink-headings'
// import remarkA11yEmoji from '@fec/remark-a11y-emoji'

function getAnchor(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/[ ]/g, '-');
}

function Heading({ Tag, children }) {
    const anchor = getAnchor(children);
    const link = `#${anchor}`;

    return (
        <a href={link} className="anchor">
            <span className="anchor-link">#</span>
            <Tag id={anchor}>{children}</Tag>
        </a>
    );
}

function ResponsiveImage(props: any) {
    return (
        <Image
            alt={props.alt}
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
            {...props}
        />
    );
}

const components = {
    h2: ({ children }: any) => (
        <Heading Tag={({ children, id }) => <h2 id={id}>{children}</h2>}>
            {children}
        </Heading>
    ),
    h3: ({ children }: any) => (
        <Heading Tag={({ children, id }) => <h3 id={id}>{children}</h3>}>
            {children}
        </Heading>
    ),
    h4: ({ children }: any) => (
        <Heading Tag={({ children, id }) => <h4 id={id}>{children}</h4>}>
            {children}
        </Heading>
    ),
    h5: ({ children }: any) => (
        <Heading Tag={({ children, id }) => <h5 id={id}>{children}</h5>}>
            {children}
        </Heading>
    ),
    h6: ({ children }: any) => (
        <Heading Tag={({ children, id }) => <h6 id={id}>{children}</h6>}>
            {children}
        </Heading>
    ),
    a: ({ children, ...props }: any) => {
        const anchor = getAnchor(children);

        return (
            <Link {...props} href={props.href || ''}>
                {children}
            </Link>
        );
    },
    img: ResponsiveImage,
};

export default function Body({ children }: { children: string }) {
    const options = {
        // Use one of Shiki's packaged themes
        theme: 'dark-plus',
        // Or your own JSON theme
        // theme: JSON.parse(
        //     fs.readFileSync(require.resolve('./themes/dark.json'), 'utf-8')
        // ),

        // Keep the background or use a custom background color?
        keepBackground: false,

        // Callback hooks to add custom logic to nodes when visiting
        // them.
        onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and
            // allow empty lines to be copy/pasted
            if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
            }
        },
        onVisitHighlightedLine(node) {
            // Each line node by default has `class="line"`.
            node.properties.className.push('highlighted');
        },
        onVisitHighlightedWord(node, id) {
            // Each word node has no className by default.
            node.properties.className = ['word'];

            if (id) {
                // If the word spans across syntax boundaries (e.g. punctuation), remove
                // colors from the child nodes.
                if (node.properties['data-rehype-pretty-code-wrapper']) {
                    node.children.forEach((childNode) => {
                        childNode.properties.style = '';
                    });
                }

                node.properties.style = '';
                node.properties['data-word-id'] = id;
            }
        },
    };

    return (
        // @ts-expect-error RSC
        <MDXRemote
            source={children}
            options={{
                mdxOptions: {
                    //   remarkPlugins: [
                    //     // Adds support for GitHub Flavored Markdown
                    //     remarkGfm,
                    //     // Makes emojis more accessible
                    //     remarkA11yEmoji,
                    //     // generates a table of contents based on headings
                    //     remarkToc,
                    //   ],
                    // These work together to add IDs and linkify headings
                    rehypePlugins: [[rehypePrettyCode, options]],
                },
            }}
            components={components}
        />
    );
}

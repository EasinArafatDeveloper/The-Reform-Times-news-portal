"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Highlighter, 
  Heading1, 
  Heading2, 
  List, 
  Quote 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your news report...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch (err) {
        alert('Upload failed');
      }
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card text-title shadow-sm flex-1 flex flex-col">
      {/* Toolbar */}
      <div className="bg-surface border-b border-border p-2 flex flex-wrap gap-1">
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          active={editor.isActive('heading', { level: 1 })}
          title="H1"
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor.isActive('heading', { level: 2 })}
          title="H2"
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        <ToolbarButton 
          onClick={setLink} 
          active={editor.isActive('link')}
          title="Add Link"
        >
          <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton 
          onClick={() => editor.chain().focus().toggleHighlight().run()} 
          active={editor.isActive('highlight')}
          title="Highlight"
        >
          <Highlighter size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-border mx-1" />

        <label className="p-2 text-caption hover:text-primary hover:bg-surface rounded-lg transition-all cursor-pointer" title="Upload Image">
          <ImageIcon size={18} />
          <input type="file" className="hidden" accept="image/*" onChange={addImage} />
        </label>
      </div>

      {/* Editor Content */}
      <div className="p-6 min-h-[400px] prose prose-sm dark:prose-invert max-w-none focus:outline-none text-body">
        <EditorContent editor={editor} className="outline-none" />
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--text-caption);
          opacity: 0.5;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          border-radius: 12px;
          margin: 20px 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid var(--primary);
          padding-left: 20px;
          font-style: italic;
          color: var(--text-body);
        }
      `}</style>
    </div>
  );
}

function ToolbarButton({ children, onClick, active, title }: any) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-all",
        active ? "bg-primary text-white" : "text-caption hover:text-primary hover:bg-surface"
      )}
    >
      {children}
    </button>
  );
}

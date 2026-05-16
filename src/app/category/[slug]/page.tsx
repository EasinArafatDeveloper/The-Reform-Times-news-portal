import { mockArticles, categories } from "@/lib/data";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/shared/NewsCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = categories.find(c => c.slug === resolvedParams.slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} News | The Reform Times`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const category = categories.find(c => c.slug === resolvedParams.slug);
  
  if (!category) {
    notFound();
  }

  const categoryArticles = mockArticles.filter(a => a.category === category.name);
  const featuredArticle = categoryArticles[0];
  const remainingArticles = categoryArticles.slice(1);

  return (
    <div className="bg-white min-h-screen">
      {/* Category Hero */}
      <div className="bg-brand-navy text-white py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h1 className="font-serif font-bold text-4xl md:text-6xl mb-4">{category.name}</h1>
          <p className="text-xl text-gray-300 font-serif italic">
            Latest news, investigations, and reports on {category.name}.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {categoryArticles.length > 0 ? (
          <>
            {/* Featured Category Article */}
            {featuredArticle && (
              <div className="mb-16 border-b border-gray-200 pb-16">
                <NewsCard article={featuredArticle} layout="horizontal" />
              </div>
            )}

            {/* Remaining Articles */}
            {remainingArticles.length > 0 && (
              <>
                <SectionHeader title="Latest Reports" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingArticles.map(article => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="font-serif font-bold text-2xl text-gray-400">No articles found in this category yet.</h2>
          </div>
        )}
      </div>
    </div>
  );
}

import { mockArticles, categories } from "@/lib/data";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/shared/NewsCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getLocalizedContent, getTranslation } from "@/lib/i18n-utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const category = categories.find(c => c.slug === slug);
  if (!category) return { title: 'Category Not Found' };

  const categoryName = getLocalizedContent<string>(category.name, locale);

  return {
    title: `${categoryName} | The Reform Times`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const category = categories.find(c => c.slug === slug);
  const isBangla = locale === 'bn';
  
  if (!category) {
    notFound();
  }

  const categoryName = getLocalizedContent<string>(category.name, locale);
  const categoryArticles = mockArticles.filter(a => {
    const articleCategory = getLocalizedContent<string>(a.category, 'en').toLowerCase();
    return articleCategory === slug.toLowerCase();
  });
  
  const featuredArticle = categoryArticles[0];
  const remainingArticles = categoryArticles.slice(1);

  return (
    <div className="bg-white dark:bg-background min-h-screen">
      {/* Category Hero */}
      <div className="bg-secondary text-white py-16 md:py-24">
        <div className="container max-w-4xl text-center">
          <h1 className="font-serif font-bold text-4xl md:text-6xl mb-4">{categoryName}</h1>
          <p className="text-xl text-white/70 font-serif italic">
            {isBangla 
              ? `${categoryName} নিয়ে সর্বশেষ সংবাদ, অনুসন্ধান এবং প্রতিবেদনসমূহ।` 
              : `Latest news, investigations, and reports on ${categoryName}.`}
          </p>
        </div>
      </div>

      <div className="container py-12">
        {categoryArticles.length > 0 ? (
          <>
            {/* Featured Category Article */}
            {featuredArticle && (
              <div className="mb-16 border-b border-border pb-16">
                <NewsCard article={featuredArticle} locale={locale} layout="horizontal" />
              </div>
            )}

            {/* Remaining Articles */}
            {remainingArticles.length > 0 && (
              <>
                <SectionHeader title={isBangla ? "সাম্প্রতিক প্রতিবেদন" : "Latest Reports"} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {remainingArticles.map(article => (
                    <NewsCard key={article.id} article={article} locale={locale} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="font-serif font-bold text-2xl text-caption">
              {isBangla ? 'এই ক্যাটাগরিতে এখনো কোনো প্রতিবেদন পাওয়া যায়নি।' : 'No articles found in this category yet.'}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

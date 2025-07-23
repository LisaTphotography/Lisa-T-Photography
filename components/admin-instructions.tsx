// Instructions for Lisa T to customize her photography website

export default function AdminInstructions() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-muted rounded-lg">
      <h2 className="text-2xl font-bold mb-4">📸 How to Customize Your Lisa T Photography Website</h2>

      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold mb-2">🖼️ Adding Your Photos</h3>
          <p className="text-muted-foreground mb-2">
            To add your own photos, edit the <code>components/photo-data.ts</code> file:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Replace the placeholder image URLs with your actual photo URLs</li>
            <li>Update the titles, descriptions, and categories</li>
            <li>Set your actual prices</li>
            <li>Mark your bestsellers and featured photos</li>
          </ol>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">💰 Setting Your Prices</h3>
          <p className="text-muted-foreground mb-2">
            In the same <code>photo-data.ts</code> file, update the price field for each photo:
          </p>
          <pre className="bg-background p-2 rounded text-sm">{`price: 125.00, // Your actual price`}</pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">📂 Customizing Categories</h3>
          <p className="text-muted-foreground mb-2">
            Update the categories array to match your photography specialties:
          </p>
          <pre className="bg-background p-2 rounded text-sm">
            {`export const categories = [
  "Weddings",
  "Portraits", 
  "Maternity",
  "Newborn",
  "Family"
]`}
          </pre>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">📝 Updating Your Bio</h3>
          <p className="text-muted-foreground mb-2">
            Edit <code>app/about/page.tsx</code> to add your personal story, experience, and approach to photography.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">📞 Contact Information</h3>
          <p className="text-muted-foreground mb-2">
            Update your contact details in <code>components/footer.tsx</code> and <code>app/contact/page.tsx</code>
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">🎨 Styling & Colors</h3>
          <p className="text-muted-foreground">
            The website uses a clean, professional design that puts your photos first. You can customize colors in the
            Tailwind config if needed.
          </p>
        </section>
      </div>
    </div>
  )
}

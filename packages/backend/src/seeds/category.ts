import CategoryModel from '../models/category'

export default async function seedCategories() {
  const categories = [
    { name: 'technology', display_name: 'Technology' },
    { name: 'personal_finance', display_name: 'Personal Finance' },
    { name: 'business_management', display_name: 'Business & Management' },
    { name: 'startups_entrepreneurship', display_name: 'Startups & Entrepreneurship' },
    { name: 'self_help', display_name: 'Self-Help' },
  ]

  await Promise.all(
    categories.map(category =>
      CategoryModel.findOneAndUpdate(
        { name: category.name },
        { $setOnInsert: category },
        { upsert: true, new: true },
      ),
    ),
  )
} 
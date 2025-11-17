import Image from 'next/image'
import { Author } from '../blog/utils'

export interface AuthorProfileProps {
  author: Author
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ]
  const index = name.length % colors.length
  return colors[index]
}

export function AuthorProfile({ author }: AuthorProfileProps) {
  const initials = getInitials(author.name)
  const bgColor = getColorFromName(author.name)

  return (
    <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-700">
      <div className="flex items-start gap-4">
        {author.avatarUrl ? (
          <Image
            src={author.avatarUrl}
            alt={`${author.name}'s avatar`}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        ) : (
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${bgColor} text-white font-bold text-xl`}
          >
            {initials}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
            {author.name}
          </h3>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
            {author.bio}
          </p>
        </div>
      </div>
    </div>
  )
}

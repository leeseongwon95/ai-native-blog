import fs from 'fs'
import path from 'path'

export type Author = {
  name: string
  bio: string
  avatarUrl?: string
}

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  author?: Author
  dingcodingco?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: any = {}

  let currentKey: string | null = null
  let currentObject: any = null

  frontMatterLines.forEach((line) => {
    // Check if line is indented (nested property)
    if (line.startsWith('  ') && currentKey) {
      let [key, ...valueArr] = line.trim().split(': ')
      let value = valueArr.join(': ').trim()
      value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes

      if (!currentObject) {
        currentObject = {}
      }
      currentObject[key.trim()] = value
      metadata[currentKey as keyof Metadata] = currentObject
    } else {
      // Top-level property
      let [key, ...valueArr] = line.split(': ')
      let value = valueArr.join(': ').trim()

      if (value) {
        // Simple key-value pair
        value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
        metadata[key.trim() as keyof Metadata] = value
        currentKey = null
        currentObject = null
      } else {
        // Key without value (nested object follows)
        // Remove trailing colon from key if present
        currentKey = key.trim().replace(/:$/, '')
        currentObject = {}
      }
    }
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

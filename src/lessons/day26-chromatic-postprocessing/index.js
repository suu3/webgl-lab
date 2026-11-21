import { createPostLesson } from '../shared/post-lesson.js'
const dispose = await createPostLesson({ chromatic: true })
import.meta.hot?.dispose(dispose)

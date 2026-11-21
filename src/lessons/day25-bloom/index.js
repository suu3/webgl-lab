import { createPostLesson } from '../shared/post-lesson.js'
const dispose = await createPostLesson()
import.meta.hot?.dispose(dispose)

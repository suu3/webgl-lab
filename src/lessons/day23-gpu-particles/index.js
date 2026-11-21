import { createParticleLesson } from '../shared/particle-lesson.js'
const dispose = await createParticleLesson(23)
import.meta.hot?.dispose(dispose)

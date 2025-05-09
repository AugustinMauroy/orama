import t from 'tap'
import { DEFAULT_SIMILARITY, findSimilarVectors, getMagnitude, Magnitude, VectorType } from '../src/trees/vector.js'
import { InternalDocumentID } from '../src/components/internal-document-id-store.js'

function toF32(vector: number[]): Float32Array {
  return new Float32Array(vector)
}

t.test('cosine similarity', async (t) => {
  t.test('getMagnitude', async (t) => {
    t.test('should return the magnitude of a vector', async (t) => {
      {
        const vector = toF32([1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        const magnitude = getMagnitude(vector, vector.length)

        t.equal(magnitude, 1)
      }

      {
        const vector = toF32([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const magnitude = getMagnitude(vector, vector.length)

        t.equal(magnitude, Math.sqrt(10))
      }

      {
        const vector = toF32([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        const magnitude = getMagnitude(vector, vector.length)

        t.equal(magnitude, Math.sqrt(385))
      }
    })
  })

  t.test('findSimilarVectors', async (t) => {
    t.test('should return the most similar vectors', async (t) => {
      const targetVector = toF32([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
      const vectors = new Map<InternalDocumentID, [Magnitude, VectorType]>([
        [1, [1, toF32([1, 0, 0, 0, 0, 0, 0, 0, 0, 0])]],
        [2, [1, toF32([0, 1, 1, 1, 1, 1, 1, 1, 1, 1])]],
        [3, [1, toF32([0, 0, 1, 1, 1, 1, 1, 1, 1, 1])]]
      ])

      const similarVectors = findSimilarVectors(
        targetVector,
        new Set(vectors.keys()),
        vectors,
        targetVector.length,
        DEFAULT_SIMILARITY
      )

      t.same(similarVectors.length, 2)
      t.same(similarVectors[0][0], 2)
      t.same(similarVectors[1][0], 3)
    })
  })
})

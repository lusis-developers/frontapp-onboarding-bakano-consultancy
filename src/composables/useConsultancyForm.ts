import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

// --- Interfaces (se mantienen fuera) ---
export interface FileStatus {
  name: string
  size: number
  uploaded: boolean
  file: File
}

// --- Definición del Esquema Base (se mantiene fuera) ---
const MAX_MENU_FILES = 5
const multiFileSchema = z
  .array(z.instanceof(File))
  .min(1, 'Debes subir al menos un archivo para el menú.')
  .max(MAX_MENU_FILES, `No puedes subir más de ${MAX_MENU_FILES} archivos.`)

const baseSchema = z.object({
  instagram: z.string().min(1, 'Cuenta de Instagram es requerida'),
  tiktok: z.string().min(1, 'Cuenta de TikTok es requerida'),
  empleados: z.preprocess((v) => String(v), z.string().min(1, 'Número de empleados es requerido')),
  ingresoMensual: z.preprocess((v) => String(v), z.string().min(1, 'Ingreso mensual es requerido')),
  ingresoAnual: z.preprocess((v) => String(v), z.string().min(1, 'Ingreso anual es requerido')),
  vendePorWhatsapp: z.boolean().optional(),
  gananciaWhatsapp: z.preprocess((v) => String(v), z.string().optional()),
  desafioPrincipal: z.string().min(1, 'Desafío principal es requerido'),
  objetivoIdeal: z.string().min(1, 'Objetivo ideal es requerido'),
  menuRestaurante: multiFileSchema.optional(),
  costoPorPlato: z.instanceof(File).optional(),
  ventasMovimientos: z.instanceof(File).optional(),
  ventasProductos: z.instanceof(File).optional(),
  ventasCliente: z.instanceof(File).optional(),
  acceptsPolicies: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar las políticas para continuar.',
  }),
})

// --- El Composable ---
export function useConsultancyForm() {
  // --- ESTADOS DE ARCHIVO ---
  const skippedFiles = ref<Record<string, boolean>>({
    menuRestaurante: false,
    costoPorPlato: false,
    ventasMovimientos: false,
    ventasProductos: false,
    ventasCliente: false,
  })
  const menuRestauranteFiles = ref<FileStatus[]>([])
  const singleFileStatuses = ref<Record<string, FileStatus | null>>({
    costoPorPlato: null,
    ventasMovimientos: null,
    ventasProductos: null,
    ventasCliente: null,
  })

  // --- ESQUEMA COMPLETO ---
  const registrationFormSchema = baseSchema
    .refine(
      (data) =>
        skippedFiles.value.menuRestaurante ||
        (data.menuRestaurante && data.menuRestaurante.length > 0),
      {
        message: "El menú es requerido si no marcas 'No tengo este archivo'.",
        path: ['menuRestaurante'],
      },
    )
    .refine(
      (data) =>
        !data.vendePorWhatsapp ||
        (data.vendePorWhatsapp && data.gananciaWhatsapp && data.gananciaWhatsapp.length > 0),
      {
        message: 'Si vendes por WhatsApp, indica la ganancia estimada.',
        path: ['gananciaWhatsapp'],
      },
    )

  // ▼▼▼ LA CORRECCIÓN ESTÁ AQUÍ ▼▼▼
  // ANTES: type FormValues estaba fuera de la función.
  // DESPUÉS: Lo movemos aquí adentro, donde `registrationFormSchema` ya existe.
  type FormValues = z.infer<typeof registrationFormSchema>

  // --- VEE-VALIDATE ---
  const { handleSubmit, values, errors, setFieldValue, validateField } = useForm<FormValues>({
    validationSchema: toTypedSchema(registrationFormSchema),
    initialValues: {
      instagram: '',
      tiktok: '',
      empleados: '',
      ingresoMensual: '',
      ingresoAnual: '',
      vendePorWhatsapp: false,
      gananciaWhatsapp: '',
      desafioPrincipal: '',
      objetivoIdeal: '',
      acceptsPolicies: false,
      menuRestaurante: [],
    },
  })

  // --- MANEJADORES DE EVENTOS ---
  const handleFormValueUpdateFromChild = (fieldName: keyof FormValues, value: any) => {
    setFieldValue(fieldName, value)
  }

  const handleAddMenuFiles = (newFiles: File[]) => {
    const newFileStatuses = newFiles.map((file) => ({
      name: file.name,
      size: file.size,
      uploaded: true,
      file,
    }))
    const combinedFiles = [...menuRestauranteFiles.value, ...newFileStatuses].slice(
      0,
      MAX_MENU_FILES,
    )
    menuRestauranteFiles.value = combinedFiles
    skippedFiles.value.menuRestaurante = false
    setFieldValue(
      'menuRestaurante',
      combinedFiles.map((f) => f.file),
    )
    validateField('menuRestaurante')
  }

  const handleRemoveMenuFile = (indexToRemove: number) => {
    const updatedFiles = menuRestauranteFiles.value.filter((_, index) => index !== indexToRemove)
    menuRestauranteFiles.value = updatedFiles
    const filesForVeeValidate = updatedFiles.map((f) => f.file)
    setFieldValue(
      'menuRestaurante',
      filesForVeeValidate.length > 0 ? filesForVeeValidate : undefined,
    )
    validateField('menuRestaurante')
  }

  const updateFile = (fieldName: string, file: File | null, isSkipped: boolean) => {
    skippedFiles.value[fieldName] = isSkipped
    if (fieldName === 'menuRestaurante') {
      if (isSkipped) {
        menuRestauranteFiles.value = []
        setFieldValue('menuRestaurante', undefined)
      }
      validateField('menuRestaurante')
      return
    }
    const fieldKey = fieldName as keyof typeof singleFileStatuses.value
    if (isSkipped || !file) {
      singleFileStatuses.value[fieldKey] = null
      setFieldValue(fieldName as any, undefined)
    } else {
      singleFileStatuses.value[fieldKey] = {
        name: file.name,
        size: file.size,
        uploaded: true,
        file,
      }
      setFieldValue(fieldName as any, file)
    }
    validateField(fieldName as any)
  }

  // --- VALORES Y FUNCIONES EXPUESTOS ---
  return {
    values,
    errors,
    skippedFiles,
    menuRestauranteFiles,
    singleFileStatuses,
    handleFormValueUpdateFromChild,
    handleAddMenuFiles,
    handleRemoveMenuFile,
    updateFile,
    handleSubmit,
    validateField,
  }
}

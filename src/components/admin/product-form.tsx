// @ts-nocheck - zod v4 has type incompatibility with react-hook-form's resolver
"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, Plus, Trash2, X, GripVertical, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  createProduct,
  updateProduct,
  type ProductImageInput,
} from "@/lib/actions/admin-products"

// ─── Schema ─────────────────────────────────────────────────────────────────

const personalisationOptionSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.string().min(1, "Type is required"),
  required: z.boolean().default(false),
  priceModifier: z.coerce.number().min(0).default(0),
})

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.coerce.number().min(0.01, "Price must be greater than 0"),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  categoryId: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  productionDays: z.coerce.number().min(1, "Production days is required"),
  isPersonalizable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  personalisationOptions: z.array(personalisationOptionSchema).optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

// ─── Types ──────────────────────────────────────────────────────────────────

interface UploadedImage {
  url: string
  altText: string
  sortOrder: number
  isPrimary: boolean
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Occasion {
  id: number
  name: string
}

interface ProductFormProps {
  mode: "create" | "edit"
  productId?: number
  categories: Category[]
  occasions: Occasion[]
  defaultValues?: {
    name: string
    slug: string
    description: string
    basePrice: number
    compareAtPrice: number | null
    categoryId: number | null
    status: string
    productionDays: number
    isPersonalizable: boolean
    isFeatured: boolean
    images: UploadedImage[]
    personalisationOptions: {
      label: string
      type: string
      required: boolean
      priceModifier: number
    }[]
    occasionIds: number[]
  }
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ProductForm({
  mode,
  productId,
  categories,
  occasions,
  defaultValues,
}: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<UploadedImage[]>(
    defaultValues?.images ?? []
  )
  const [selectedOccasions, setSelectedOccasions] = useState<number[]>(
    defaultValues?.occasionIds ?? []
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProductFormValues>({
    // @ts-expect-error - zod v4 resolver type mismatch with react-hook-form
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      slug: defaultValues?.slug ?? "",
      description: defaultValues?.description ?? "",
      basePrice: defaultValues?.basePrice ?? 0,
      compareAtPrice: defaultValues?.compareAtPrice ?? undefined,
      categoryId: defaultValues?.categoryId?.toString() ?? "",
      status: defaultValues?.status?.toLowerCase() ?? "draft",
      productionDays: defaultValues?.productionDays ?? 3,
      isPersonalizable: defaultValues?.isPersonalizable ?? false,
      isFeatured: defaultValues?.isFeatured ?? false,
      personalisationOptions: defaultValues?.personalisationOptions ?? [],
    },
  })

  const isPersonalizable = form.watch("isPersonalizable")

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "personalisationOptions",
  })

  // ─── Image Upload ───────────────────────────────────────────────────────

  const handleFileUpload = useCallback(async (files: FileList) => {
    setUploading(true)
    setError(null)

    try {
      const newImages: UploadedImage[] = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Upload failed")
        }

        const data = await res.json()
        newImages.push({
          url: data.url,
          altText: "",
          sortOrder: images.length + newImages.length,
          isPrimary: images.length === 0 && newImages.length === 0,
        })
      }

      setImages((prev) => [...prev, ...newImages])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }, [images.length])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files)
      }
    },
    [handleFileUpload]
  )

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      // If we removed the primary, make the first one primary
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true
      }
      return updated.map((img, i) => ({ ...img, sortOrder: i }))
    })
  }

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    )
  }

  const toggleOccasion = (occasionId: number) => {
    setSelectedOccasions((prev) =>
      prev.includes(occasionId)
        ? prev.filter((id) => id !== occasionId)
        : [...prev, occasionId]
    )
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function onSubmit(data: ProductFormValues) {
    setSaving(true)
    setError(null)

    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice || null,
        categoryId: data.categoryId ? parseInt(data.categoryId) : null,
        status: data.status.toUpperCase() as "ACTIVE" | "DRAFT" | "ARCHIVED",
        productionDays: data.productionDays,
        isPersonalizable: data.isPersonalizable,
        isFeatured: data.isFeatured,
        images: images as ProductImageInput[],
        personalisationOptions: data.personalisationOptions ?? [],
        occasionIds: selectedOccasions,
      }

      if (mode === "create") {
        const result = await createProduct(payload)
        if (result.success) {
          router.push("/admin/products")
        }
      } else if (mode === "edit" && productId) {
        const result = await updateProduct(productId, payload)
        if (result.success) {
          router.push("/admin/products")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form {...form}>
      {/* @ts-expect-error - zod v4 resolver type mismatch with react-hook-form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Personalised Wooden Chopping Board"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (mode === "create") {
                            form.setValue("slug", generateSlug(e.target.value))
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="personalised-wooden-chopping-board"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your product..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (&pound;)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="compareAtPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare At Price (&pound;)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Optional"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productionDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Days</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="isPersonalizable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Is Personalizable</FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Is Featured</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={image.url}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
                      image.isPrimary
                        ? "border-primary"
                        : "border-muted"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || "Product image"}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          image.isPrimary
                            ? "bg-primary text-primary-foreground"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {image.isPrimary ? "Primary" : "Set Primary"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="rounded bg-destructive p-1 text-white hover:bg-destructive/80"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div
              className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12 transition-colors hover:border-muted-foreground/50"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {uploading ? (
                  <Loader2 className="mx-auto size-10 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="mx-auto size-10 text-muted-foreground" />
                )}
                <p className="mt-2 text-sm font-medium">
                  {uploading
                    ? "Uploading..."
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or WebP (max 5MB)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) {
                  handleFileUpload(e.target.files)
                  e.target.value = ""
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Occasions */}
        {occasions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Occasions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {occasions.map((occasion) => (
                  <label
                    key={occasion.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors ${
                      selectedOccasions.includes(occasion.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-muted hover:border-muted-foreground/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedOccasions.includes(occasion.id)}
                      onCheckedChange={() => toggleOccasion(occasion.id)}
                    />
                    {occasion.name}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personalisation Options */}
        {isPersonalizable && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personalisation Options</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    label: "",
                    type: "text",
                    required: false,
                    priceModifier: 0,
                  })
                }
              >
                <Plus className="size-4" />
                Add Option
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No personalisation options added yet. Click &quot;Add
                  Option&quot; to create one.
                </p>
              )}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-4 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_auto_auto_auto]"
                >
                  <FormField
                    control={form.control}
                    name={`personalisationOptions.${index}.label`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`personalisationOptions.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="image">Image Upload</SelectItem>
                            <SelectItem value="dropdown">Dropdown</SelectItem>
                            <SelectItem value="colour">Colour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`personalisationOptions.${index}.priceModifier`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (&pound;)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`personalisationOptions.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex items-end gap-2 pb-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Required</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex items-end pb-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={saving || uploading}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            {mode === "create" ? "Create Product" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

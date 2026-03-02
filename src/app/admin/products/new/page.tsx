// @ts-nocheck - zod v4 has type incompatibility with react-hook-form's resolver
"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, Plus, Trash2 } from "lucide-react"
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
  compareAtPrice: z.coerce.number().min(0).optional(),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  productionDays: z.coerce.number().min(1, "Production days is required"),
  isPersonalizable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  personalisationOptions: z.array(personalisationOptionSchema).optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function NewProductPage() {
  const [isPersonalizable, setIsPersonalizable] = useState(false)

  const form = useForm<ProductFormValues>({
    // @ts-expect-error - zod v4 resolver type mismatch with react-hook-form
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      basePrice: 0,
      compareAtPrice: undefined,
      category: "",
      status: "draft",
      productionDays: 3,
      isPersonalizable: false,
      isFeatured: false,
      personalisationOptions: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "personalisationOptions",
  })

  function onSubmit(data: ProductFormValues) {
    console.log("Product data:", data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
        <p className="text-muted-foreground">
          Create a new product for your store.
        </p>
      </div>

      <Form {...form}>
        {/* @ts-expect-error - zod v4 resolver type mismatch with react-hook-form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            form.setValue("slug", generateSlug(e.target.value))
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
                  name="category"
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
                          <SelectItem value="kitchen">Kitchen</SelectItem>
                          <SelectItem value="jewellery">Jewellery</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="prints">Prints</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="stationery">Stationery</SelectItem>
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
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            setIsPersonalizable(!!checked)
                          }}
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

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-12">
                <div className="text-center">
                  <Upload className="mx-auto size-10 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or WebP (max 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                              <SelectItem value="select">Dropdown</SelectItem>
                              <SelectItem value="color">Colour</SelectItem>
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

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Create Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { adminService } from '@/services';
import type { Category, ProductVariant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SIZES } from '@/constants';

const SIZE_OPTIONS = SIZES as ProductVariant['size'][];

const emptyForm = {
  name: '',
  description: '',
  category: '',
  collection: '',
  price: '',
  salePrice: '',
  material: '',
  fit: '',
  washCare: '',
  occasion: '',
  season: '',
  featured: false,
  bestSeller: false,
  newArrival: true,
  comingSoon: false,
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category');
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantColor, setVariantColor] = useState('');
  const [variantSize, setVariantSize] = useState<ProductVariant['size']>('M');
  const [variantStock, setVariantStock] = useState('0');
  const [variantSku, setVariantSku] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      adminService.getCategories(),
      adminService.getCollectionOptions(),
      id ? adminService.getProduct(id) : Promise.resolve(null),
    ])
      .then(([cats, cols, product]) => {
        setCategories(cats);
        setCollections(cols);
        if (product) {
          setForm({
            name: product.name,
            description: product.description,
            category: cats.find((c) => c.name === product.category)?.id || '',
            collection: '',
            price: String(product.price),
            salePrice: product.compareAtPrice ? String(product.price) : '',
            material: '',
            fit: '',
            washCare: '',
            occasion: '',
            season: '',
            featured: !!product.isTrending,
            bestSeller: !!product.isBestSeller,
            newArrival: !!product.isNew,
            comingSoon: false,
          });
          setExistingImages(product.images);
          setTags(product.tags);
          setVariants(
            product.sizes.map((s) => ({
              color: product.colors[0]?.name || 'Default',
              size: s.label as ProductVariant['size'],
              stock: s.inStock ? 10 : 0,
              sku: `${product.slug}-${s.label}`,
            })),
          );
        } else if (preselectedCategory && cats.some((c) => c.id === preselectedCategory)) {
          setForm((f) => ({ ...f, category: preselectedCategory }));
        }
      })
      .catch(() => toast({ title: 'Failed to load form data', variant: 'destructive' }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files);
    setNewImageFiles((prev) => [...prev, ...fileArr]);
    fileArr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewImagePreviews((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const addVariant = () => {
    if (!variantColor.trim() || !variantSku.trim()) {
      toast({ title: 'Color and SKU are required for a variant', variant: 'destructive' });
      return;
    }
    setVariants((prev) => [
      ...prev,
      { color: variantColor.trim(), size: variantSize, stock: Number(variantStock) || 0, sku: variantSku.trim() },
    ]);
    setVariantColor('');
    setVariantStock('0');
    setVariantSku('');
  };

  const removeVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.category || !form.collection) {
      toast({ title: 'Name, price, category and collection are required', variant: 'destructive' });
      return;
    }
    if (variants.length === 0) {
      toast({ title: 'Add at least one variant (color/size/stock)', variant: 'destructive' });
      return;
    }
    if (!isEdit && newImageFiles.length === 0) {
      toast({ title: 'Add at least one product image', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description,
        category: form.category,
        collection: form.collection,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        material: form.material,
        fit: form.fit,
        washCare: form.washCare,
        occasion: form.occasion,
        season: form.season,
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        comingSoon: form.comingSoon,
        tags,
        variants,
        imageFiles: newImageFiles,
      };

      if (isEdit && id) {
        await adminService.updateProduct(id, payload);
        toast({ title: 'Product updated' });
      } else {
        await adminService.createProduct(payload);
        toast({ title: 'Product created' });
      }
      navigate('/admin/products');
    } catch (err) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const message = apiMessage || (err instanceof Error ? err.message : 'Something went wrong');
      toast({ title: message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-semibold mb-1">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {isEdit ? "Update this product's details." : 'Upload a new item to the store.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <section className="rounded-lg border border-border bg-background p-6 space-y-4">
          <h2 className="font-medium">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Silk Slip Dress"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger id="category">
                  <SelectValue placeholder={categories.length ? 'Select category' : 'No categories yet'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {categories.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No categories exist yet — create one on the Categories page first.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="collection">Collection *</Label>
              <Select value={form.collection} onValueChange={(v) => setForm((f) => ({ ...f, collection: v }))}>
                <SelectTrigger id="collection">
                  <SelectValue placeholder={collections.length ? 'Select collection' : 'No collections yet'} />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salePrice">Sale Price (₹)</Label>
              <Input
                id="salePrice"
                type="number"
                min="0"
                value={form.salePrice}
                onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
                placeholder="Optional — shows a strikethrough price"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="material">Material</Label>
              <Input id="material" value={form.material} onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fit">Fit</Label>
              <Input id="fit" value={form.fit} onChange={(e) => setForm((f) => ({ ...f, fit: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="washCare">Wash Care</Label>
              <Input id="washCare" value={form.washCare} onChange={(e) => setForm((f) => ({ ...f, washCare: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="occasion">Occasion</Label>
              <Input id="occasion" value={form.occasion} onChange={(e) => setForm((f) => ({ ...f, occasion: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="season">Season</Label>
              <Input id="season" value={form.season} onChange={(e) => setForm((f) => ({ ...f, season: e.target.value }))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-lg border border-border bg-background p-6 space-y-4">
          <h2 className="font-medium">Images {!isEdit && '*'}</h2>
          <p className="text-xs text-muted-foreground -mt-2">
            Add 1 photo minimum — 2-3 recommended so customers can see the item from different angles.
            The first photo is used as the cover image.
          </p>
          {existingImages.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Current images (upload new ones below to replace them)
              </p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, i) => (
                  <img key={i} src={img} alt="" className="h-24 w-20 object-cover rounded-md" />
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {newImagePreviews.map((img, i) => (
              <div key={i} className="relative h-24 w-20 shrink-0">
                <img src={img} alt="" className="h-full w-full object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-24 w-20 shrink-0 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span className="text-[10px]">Upload</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </section>

        {/* Variants */}
        <section className="rounded-lg border border-border bg-background p-6 space-y-4">
          <h2 className="font-medium">Variants (Color / Size / Stock) *</h2>
          {variants.length > 0 && (
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="flex items-center gap-3 text-sm border border-border rounded-md px-3 py-2">
                  <span className="font-medium">{v.color}</span>
                  <span className="text-muted-foreground">{v.size}</span>
                  <span className="text-muted-foreground">Stock: {v.stock}</span>
                  <span className="text-muted-foreground text-xs">SKU: {v.sku}</span>
                  <button type="button" onClick={() => removeVariant(i)} className="ml-auto" aria-label="Remove variant">
                    <X className="h-4 w-4 text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="grid sm:grid-cols-5 gap-2 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">Color</Label>
              <Input value={variantColor} onChange={(e) => setVariantColor(e.target.value)} placeholder="e.g. Blush" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Size</Label>
              <Select value={variantSize} onValueChange={(v) => setVariantSize(v as ProductVariant['size'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Stock</Label>
              <Input type="number" min="0" value={variantStock} onChange={(e) => setVariantStock(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">SKU</Label>
              <Input value={variantSku} onChange={(e) => setVariantSku(e.target.value)} placeholder="e.g. DRS-BLU-M" />
            </div>
            <Button type="button" variant="outline" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </section>

        {/* Tags & flags */}
        <section className="rounded-lg border border-border bg-background p-6 space-y-5">
          <h2 className="font-medium">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((t, i) => (
              <span key={i} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-sm">
                {t}
                <button type="button" onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-md">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              Add
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {(
              [
                ['newArrival', 'Mark as New Arrival'],
                ['bestSeller', 'Mark as Best Seller'],
                ['featured', 'Mark as Featured'],
                ['comingSoon', 'Coming Soon'],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                <Label htmlFor={key} className="cursor-pointer">
                  {label}
                </Label>
                <Switch
                  id={key}
                  checked={form[key]}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, [key]: v }))}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              'Save Changes'
            ) : (
              'Create Product'
            )}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

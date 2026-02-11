"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2 } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Stepper, StepperStep } from "@/components/ui/stepper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ========== Zod: regex and refine usage ==========
const phoneRegex = /^\+?[0-9]{9,15}$/;
const postalCodeRegex = /^[0-9]{2}-[0-9]{3}$/;
const cardNumberRegex = /^[0-9]{16}$/;
const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
const cvvRegex = /^[0-9]{3,4}$/;

// Step 1: Personal schema
const personalSchema = z.object({
  firstName: z
    .string()
    .min(2, "Imie musi miec co najmniej 2 znaki")
    .max(50, "Imie moze miec maksymalnie 50 znakow"),
  lastName: z
    .string()
    .min(2, "Nazwisko musi miec co najmniej 2 znaki")
    .max(50, "Nazwisko moze miec maksymalnie 50 znakow"),
  email: z.string().email("Podaj poprawny adres email"),
  phone: z
    .string()
    .regex(phoneRegex, "Podaj poprawny numer telefonu (9-15 cyfr)")
    .refine(
      (val) => !val.startsWith("0000"),
      "Numer telefonu nie moze zaczynac sie od 0000"
    ),
});

// Step 2: Address schema
const addressSchema = z.object({
  street: z.string().min(3, "Podaj adres ulicy"),
  city: z.string().min(2, "Podaj nazwe miasta"),
  postalCode: z
    .string()
    .regex(postalCodeRegex, "Format kodu: XX-XXX")
    .refine(
      (val) => {
        const num = parseInt(val.replace("-", ""), 10);
        return num >= 0 && num <= 99999;
      },
      "Podaj poprawny kod pocztowy"
    ),
  country: z.string().min(1, "Wybierz kraj"),
});

// Step 3: Payment schema with refine
const paymentSchema = z
  .object({
    cardNumber: z
      .string()
      .regex(cardNumberRegex, "Numer karty musi miec 16 cyfr"),
    expiryDate: z
      .string()
      .regex(expiryRegex, "Format daty: MM/RR"),
    cvv: z.string().regex(cvvRegex, "CVV musi miec 3-4 cyfry"),
    cardHolder: z
      .string()
      .min(3, "Podaj imie i nazwisko posiadacza karty")
      .refine(
        (val) => val.includes(" "),
        "Podaj pelne imie i nazwisko (z odstepem)"
      ),
    acceptTerms: z.boolean(),
    recaptchaToken: z.string().min(1, "Potwierdz, ze nie jestes robotem"),
  })
  .refine((data) => data.acceptTerms === true, {
    message: "Musisz zaakceptowac regulamin",
    path: ["acceptTerms"],
  });

// Combined schema
const checkoutSchema = personalSchema.merge(addressSchema).merge(
  z.object({
    cardNumber: z.string().regex(cardNumberRegex, "Numer karty musi miec 16 cyfr"),
    expiryDate: z.string().regex(expiryRegex, "Format daty: MM/RR"),
    cvv: z.string().regex(cvvRegex, "CVV musi miec 3-4 cyfry"),
    cardHolder: z
      .string()
      .min(3, "Podaj imie i nazwisko posiadacza karty")
      .refine((val) => val.includes(" "), "Podaj pelne imie i nazwisko"),
    acceptTerms: z.boolean().refine((v) => v === true, "Musisz zaakceptowac regulamin"),
    recaptchaToken: z.string().min(1, "Potwierdz, ze nie jestes robotem"),
  })
);

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const STEPS = [
  { title: "Dane osobowe", description: "Imie, email, telefon" },
  { title: "Adres", description: "Adres dostawy" },
  { title: "Platnosc", description: "Dane karty" },
];

const stepFields: Record<number, (keyof CheckoutFormValues)[]> = {
  0: ["firstName", "lastName", "email", "phone"],
  1: ["street", "city", "postalCode", "country"],
  2: ["cardNumber", "expiryDate", "cvv", "cardHolder", "acceptTerms", "recaptchaToken"],
};

// ========== React Hook Form: Custom control (reCAPTCHA sim) ==========

export function CheckoutForm() {
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { items, totalPrice, clearCart, totalItems } = useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      city: "",
      postalCode: "",
      country: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolder: "",
      acceptTerms: false,
      recaptchaToken: "",
    },
    mode: "onTouched",
  });

  // ========== Multi-step form: validate current step before going next ==========
  const handleNext = async () => {
    const fields = stepFields[step];
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = (data: CheckoutFormValues) => {
    console.log("Order submitted:", data);
    setShowSuccess(true);
    clearCart();
  };

  return (
    <>
      {/* ========== Shadcn: Compound Components Stepper ========== */}
      <div className="mb-8">
        <Stepper currentStep={step}>
          {STEPS.map((s, i) => (
            <StepperStep key={s.title} index={i} title={s.title} description={s.description} />
          ))}
        </Stepper>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* ========== Shadcn: Form integration with React Hook Form ========== */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">{STEPS[step].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Step 1: Personal */}
                  {step === 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Imie</FormLabel>
                            <FormControl>
                              <Input placeholder="Jan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nazwisko</FormLabel>
                            <FormControl>
                              <Input placeholder="Kowalski" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="jan@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="+48123456789" {...field} />
                            </FormControl>
                            <FormDescription>
                              Format: 9-15 cyfr, opcjonalnie z +
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Address */}
                  {step === 1 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Ulica i numer</FormLabel>
                            <FormControl>
                              <Input placeholder="ul. Przykladowa 10" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Miasto</FormLabel>
                            <FormControl>
                              <Input placeholder="Warszawa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kod pocztowy</FormLabel>
                            <FormControl>
                              <Input placeholder="00-000" {...field} />
                            </FormControl>
                            <FormDescription>Format: XX-XXX</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {/* ========== React Hook Form: Custom control (Select) ========== */}
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Kraj</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Wybierz kraj" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PL">Polska</SelectItem>
                                <SelectItem value="DE">Niemcy</SelectItem>
                                <SelectItem value="CZ">Czechy</SelectItem>
                                <SelectItem value="SK">Slowacja</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {step === 2 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="cardHolder"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Posiadacz karty</FormLabel>
                            <FormControl>
                              <Input placeholder="Jan Kowalski" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Numer karty</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="1234567890123456"
                                  maxLength={16}
                                  {...field}
                                />
                                <CreditCard className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormDescription>16 cyfr bez spacji</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data waznosci</FormLabel>
                            <FormControl>
                              <Input placeholder="MM/RR" maxLength={5} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="***"
                                maxLength={4}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* ========== reCAPTCHA* custom control ========== */}
                      <FormField
                        control={form.control}
                        name="recaptchaToken"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <FormLabel>Weryfikacja</FormLabel>
                            <FormControl>
                              <ReCAPTCHA
                                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test sitekey, replace with your own
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Accept terms checkbox */}
                      <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2">
                            <div className="flex items-start gap-3">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="leading-none">
                                <FormLabel className="cursor-pointer">
                                  Akceptuje regulamin i polityke prywatnosci
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={step === 0}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Wstecz
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Dalej
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-transform"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Zamawiam i place
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>

        {/* Summary sidebar */}
        <div>
          <Card className="sticky top-24 border border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Zamowienie</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground">Koszyk jest pusty</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} x{item.quantity}
                      </span>
                      <span className="font-mono text-foreground">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Razem</span>
                      <span className="font-mono font-bold text-foreground">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zamowienie zlozone!</DialogTitle>
            <DialogDescription>
              Dziekujemy za zakupy w TechNova. Twoje zamowienie zostalo przyjete i
              wkrotce otrzymasz potwierdzenie na podany adres email.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

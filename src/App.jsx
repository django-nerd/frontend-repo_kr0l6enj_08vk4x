import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useFetch(url, options) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { refetch() }, [url])
  return { data, loading, error, refetch }
}

function Navbar({ onNav }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur bg-black/60 border-b border-blue-900/40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-blue-300" />
          <span className="text-white font-bold tracking-wide">Vechnost</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {['Beranda','TopUp','Pulsa/Data','Joki','Voucher/Akun','Top Rank','Rating','Kalkulator','Admin','Login'].map((x) => (
            <button key={x} onClick={() => onNav(x)} className="text-blue-200 hover:text-white transition">{x}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="bg-gradient-to-b from-black via-[#0a0f1a] to-black">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          TopUp Game Otomatis berkecepatan tinggi
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">dengan Vechnost</span>
        </h1>
        <p className="mt-4 text-blue-200/80 max-w-2xl">
          Dukung provider VIP & Digiflazz, pembayaran otomatis Tripay & Tokopay, verifikasi ID game, dan banyak lagi.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="#topup" className="px-5 py-2.5 rounded bg-blue-500 hover:bg-blue-400 text-white font-semibold">Mulai TopUp</a>
          <a href="#admin" className="px-5 py-2.5 rounded border border-blue-500/50 text-blue-200 hover:bg-blue-500/10">Masuk Admin</a>
        </div>
      </div>
    </div>
  )
}

function CategoryFilter({ categories, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-auto pb-2">
      <button onClick={() => onChange('')} className={`px-3 py-1.5 rounded border ${value===''? 'bg-blue-600 text-white border-blue-500':'border-blue-900/40 text-blue-200 hover:bg-blue-600/20'}`}>Semua</button>
      {categories?.map(c => (
        <button key={c.id} onClick={() => onChange(c.id)} className={`px-3 py-1.5 rounded border ${value===c.id? 'bg-blue-600 text-white border-blue-500':'border-blue-900/40 text-blue-200 hover:bg-blue-600/20'}`}>{c.name}</button>
      ))}
    </div>
  )
}

function Products() {
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')
  const { data: categories } = useFetch(`${API_BASE}/api/categories`)
  const productsUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    return `${API_BASE}/api/products?${params.toString()}`
  }, [category, q])
  const { data: products, loading } = useFetch(productsUrl)

  return (
    <section id="produk" className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Produk</h2>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari produk..." className="bg-black/60 border border-blue-900/40 focus:border-blue-600 outline-none rounded px-3 py-1.5 text-blue-100 placeholder:text-blue-300/40" />
        </div>
      </div>
      <CategoryFilter categories={categories||[]} value={category} onChange={setCategory} />
      {loading ? <p className="text-blue-200 mt-4">Memuat...</p> : (
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(products||[]).map(p => (
            <div key={p.id} className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
              <div className="text-white font-semibold">{p.title}</div>
              <div className="text-blue-300 text-sm line-clamp-2 mt-1">{p.description || '—'}</div>
              <div className="mt-3 text-blue-200">Rp {Number(p.price).toLocaleString('id-ID')}</div>
              <a href="#topup" className="mt-3 inline-block px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm">Beli</a>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CheckId() {
  const [game, setGame] = useState('Mobile Legends')
  const [uid, setUid] = useState('')
  const [server, setServer] = useState('')
  const [result, setResult] = useState(null)
  const onCheck = async () => {
    setResult({ loading: true })
    const res = await fetch(`${API_BASE}/api/tools/check-game-id`, {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ game, user_id: uid, server })
    })
    const json = await res.json()
    setResult(json)
  }
  return (
    <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
      <div className="text-white font-semibold mb-2">Cek ID Game</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input value={game} onChange={e=>setGame(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
        <input value={uid} onChange={e=>setUid(e.target.value)} placeholder="User ID" className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
        <input value={server} onChange={e=>setServer(e.target.value)} placeholder="Server (opsional)" className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
      </div>
      <button onClick={onCheck} className="mt-3 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Cek</button>
      {result && (
        <div className="mt-3 text-blue-200 text-sm">
          {result.loading ? 'Memeriksa...' : (result.valid ? `Valid ✓ Nickname: ${result.nickname}` : `Tidak valid: ${result.message || '-'}`)}
        </div>
      )}
    </div>
  )
}

function Calculator() {
  const [price, setPrice] = useState(10000)
  const [amount, setAmount] = useState(1)
  const [feeP, setFeeP] = useState(0)
  const [feeF, setFeeF] = useState(0)
  const [res, setRes] = useState(null)
  const calc = async () => {
    const r = await fetch(`${API_BASE}/api/tools/calc`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ price: Number(price)||0, amount: Number(amount)||1, fee_percent: Number(feeP)||0, fee_flat: Number(feeF)||0 }) })
    setRes(await r.json())
  }
  useEffect(()=>{ calc() }, [])
  return (
    <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
      <div className="text-white font-semibold mb-2">Kalkulator</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" placeholder="Harga" />
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" placeholder="Jumlah" />
        <input type="number" value={feeP} onChange={e=>setFeeP(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" placeholder="Fee %" />
        <input type="number" value={feeF} onChange={e=>setFeeF(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" placeholder="Fee flat" />
      </div>
      <button onClick={calc} className="mt-3 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Hitung</button>
      {res && (
        <div className="mt-3 text-blue-200 text-sm">Subtotal: Rp {Number(res.base||0).toLocaleString('id-ID')} · Total: <span className="text-white font-semibold">Rp {Number(res.total||0).toLocaleString('id-ID')}</span></div>
      )}
    </div>
  )
}

function OrderForm() {
  const { data: methods } = useFetch(`${API_BASE}/api/payment-methods`)
  const { data: products } = useFetch(`${API_BASE}/api/products`)
  const [productId, setProductId] = useState('')
  const [amount, setAmount] = useState(1)
  const [target, setTarget] = useState('')
  const [method, setMethod] = useState('')
  const [result, setResult] = useState(null)
  const onOrder = async () => {
    setResult({ loading: true })
    const prod = products?.find(p=>p.id===productId)
    const payload = {
      product_id: productId,
      amount: Number(amount)||1,
      target_id: target || null,
      payment_method_code: method || null,
      provider: prod?.provider || 'manual',
    }
    const r = await fetch(`${API_BASE}/api/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const json = await r.json()
    setResult(json)
  }
  useEffect(()=>{
    if (products && products.length>0 && !productId) setProductId(products[0].id)
  }, [products])
  return (
    <section id="topup" className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold text-white mb-4">TopUp Instan</h2>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <CheckId />
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Form Pemesanan</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <select value={productId} onChange={e=>setProductId(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100">
                {(products||[]).map(p=> (<option key={p.id} value={p.id}>{p.title} — Rp {Number(p.price).toLocaleString('id-ID')}</option>))}
              </select>
              <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Jumlah" className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
              <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="User ID / Nomor" className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
              <select value={method} onChange={e=>setMethod(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100">
                <option value="">Pilih Metode Pembayaran</option>
                {(methods||[]).map(m=> (<option key={m.id} value={m.code}>{m.name}</option>))}
              </select>
            </div>
            <button onClick={onOrder} className="mt-3 px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Buat Pesanan</button>
            {result && (
              <div className="mt-3 text-blue-200 text-sm">
                {result.loading? 'Memproses...' : (
                  <div>
                    <div>Total: <span className="text-white font-semibold">Rp {Number(result.total_price||0).toLocaleString('id-ID')}</span></div>
                    {result.payment_url ? (
                      <a className="text-blue-300 underline" href={result.payment_url} target="_blank">Lanjut Pembayaran</a>
                    ): <div className="text-blue-300">Silakan selesaikan pembayaran sesuai instruksi.</div>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <Calculator />
          <TopRank compact />
        </div>
      </div>
    </section>
  )
}

function TopRank({ compact=false }) {
  const { data } = useFetch(`${API_BASE}/api/top`)
  if (!data) return <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4 text-blue-200">Memuat...</div>
  return (
    <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
      <div className="text-white font-semibold mb-2">Top Ranking Layanan</div>
      <div className="space-y-2">
        {data.map((r, i) => (
          <div key={i} className="flex items-center justify-between text-blue-200">
            <div className="truncate">{i+1}. {r.product_title || r.product_id}</div>
            <div className="text-blue-300 text-sm">{r.orders} pesanan</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Ratings() {
  const { data: products } = useFetch(`${API_BASE}/api/products`)
  const [pid, setPid] = useState('')
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')
  const [list, setList] = useState([])

  useEffect(()=>{ if(products && products[0]) { setPid(products[0].id) } },[products])
  const load = async (p) => {
    if (!p) return
    const res = await fetch(`${API_BASE}/api/ratings/${p}`)
    setList(await res.json())
  }
  useEffect(()=>{ load(pid) },[pid])

  const submit = async () => {
    await fetch(`${API_BASE}/api/ratings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ product_id: pid, stars: Number(stars)||5, comment }) })
    setComment('')
    await load(pid)
  }

  return (
    <section id="rating" className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold text-white mb-4">Rating</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
          <div className="text-white font-semibold mb-2">Tulis Ulasan</div>
          <select value={pid} onChange={e=>setPid(e.target.value)} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full mb-2">
            {(products||[]).map(p=> (<option key={p.id} value={p.id}>{p.title}</option>))}
          </select>
          <input type="number" value={stars} onChange={e=>setStars(e.target.value)} min={1} max={5} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full mb-2" />
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Komentar" className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full" />
          <button onClick={submit} className="mt-3 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Kirim</button>
        </div>
        <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
          <div className="text-white font-semibold mb-2">Apa kata pelanggan</div>
          <div className="space-y-3">
            {list?.length? list.map((r,i)=> (
              <div key={i} className="border border-blue-900/30 rounded p-3">
                <div className="text-yellow-400">{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</div>
                <div className="text-blue-200 text-sm mt-1">{r.comment||'—'}</div>
              </div>
            )) : <div className="text-blue-300">Belum ada ulasan.</div>}
          </div>
        </div>
      </div>
    </section>
  )
}

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resp, setResp] = useState(null)
  const submit = async () => {
    setResp('...')
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    const body = isLogin ? { email, password } : { name, email, password }
    const r = await fetch(`${API_BASE}${endpoint}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    const j = await r.json()
    setResp(j)
  }
  return (
    <section id="auth" className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold text-white mb-4">{isLogin? 'Login':'Register'}</h2>
      <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4 max-w-md">
        {!isLogin && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama" className="mb-2 w-full bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="mb-2 w-full bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="mb-2 w-full bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100" />
        <button onClick={submit} className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Kirim</button>
        <button onClick={()=>setIsLogin(!isLogin)} className="ml-3 text-blue-300 underline">{isLogin? 'Daftar':'Sudah punya akun? Login'}</button>
        <div className="mt-3 text-blue-200 text-sm break-all">{resp && JSON.stringify(resp)}</div>
      </div>
    </section>
  )
}

function Admin() {
  const [tab, setTab] = useState('produk')
  const { data: categories, refetch: refCat } = useFetch(`${API_BASE}/api/categories`)
  const { data: products, refetch: refProd } = useFetch(`${API_BASE}/api/products`)
  const { data: methods, refetch: refPay } = useFetch(`${API_BASE}/api/payment-methods`)
  const { data: overview, refetch: refOverview } = useFetch(`${API_BASE}/api/admin/overview`)

  // helpers
  const addCategory = async (name) => {
    const slug = name.toLowerCase().replace(/\s+/g,'-')
    await fetch(`${API_BASE}/api/admin/categories`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, slug }) })
    refCat()
  }
  const delCategory = async (id) => { await fetch(`${API_BASE}/api/admin/categories/${id}`, { method:'DELETE' }); refCat() }

  const addProduct = async (title, price) => { await fetch(`${API_BASE}/api/admin/products`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, price: Number(price)||0, type:'game_topup', is_active:true }) }); refProd() }
  const delProduct = async (id) => { await fetch(`${API_BASE}/api/admin/products/${id}`, { method:'DELETE' }); refProd() }

  const addPayment = async (name, code, gateway) => { await fetch(`${API_BASE}/api/admin/payment-methods`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, code, gateway, is_active:true }) }); refPay() }
  const delPayment = async (id) => { await fetch(`${API_BASE}/api/admin/payment-methods/${id}`, { method:'DELETE' }); refPay() }

  return (
    <section id="admin" className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold text-white mb-4">Admin Panel</h2>
      <div className="mb-4 flex gap-2">
        {['produk','kategori','pembayaran','monitor'].map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1.5 rounded border ${tab===t? 'bg-blue-600 text-white border-blue-500':'border-blue-900/40 text-blue-200 hover:bg-blue-600/20'}`}>{t}</button>
        ))}
      </div>
      {tab==='produk' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Tambah Produk</div>
            <FormTwo onSubmit={(a,b)=>addProduct(a,b)} labels={["Judul","Harga"]} placeholders={["Diamond ML 86","15000"]} />
          </div>
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Daftar Produk</div>
            <List items={(products||[]).map(p=>({ id:p.id, title:`${p.title} — Rp ${Number(p.price).toLocaleString('id-ID')}` }))} onDelete={delProduct} />
          </div>
        </div>
      )}
      {tab==='kategori' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Tambah Kategori</div>
            <FormOne onSubmit={(a)=>addCategory(a)} label="Nama Kategori" placeholder="Mobile Legends" />
          </div>
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Daftar Kategori</div>
            <List items={(categories||[]).map(c=>({ id:c.id, title:c.name }))} onDelete={delCategory} />
          </div>
        </div>
      )}
      {tab==='pembayaran' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Tambah Metode</div>
            <FormThree onSubmit={(a,b,c)=>addPayment(a,b,c)} labels={["Nama","Kode","Gateway (tripay/tokopay/manual)"]} placeholders={["QRIS Tripay","QRIS","tripay"]} />
          </div>
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Metode Aktif</div>
            <List items={(methods||[]).map(m=>({ id:m.id, title:`${m.name} (${m.code})` }))} onDelete={delPayment} />
          </div>
        </div>
      )}
      {tab==='monitor' && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Ringkasan</div>
            {!overview? <div className="text-blue-200">Memuat...</div> : (
              <div className="text-blue-200 space-y-1">
                <div>Users: {overview.users}</div>
                <div>Products: {overview.products}</div>
                <div>Orders: {overview.orders}</div>
                <div>Deposits: {overview.deposits}</div>
                <div>Pending: {overview.pending_orders} · Paid: {overview.paid_orders}</div>
              </div>
            )}
          </div>
          <div className="rounded border border-blue-900/40 bg-[#0b1220] p-4">
            <div className="text-white font-semibold mb-2">Pesanan Terbaru</div>
            <div className="space-y-2 max-h-80 overflow-auto">
              {overview?.recent_orders?.map((o,i)=> (
                <div key={i} className="border border-blue-900/30 rounded p-3 text-blue-200 text-sm">
                  <div>ID: {o._id}</div>
                  <div>Status: {o.status}</div>
                  <div>Total: Rp {Number(o.total_price||0).toLocaleString('id-ID')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function List({ items, onDelete }) {
  return (
    <div className="space-y-2">
      {(items||[]).length? items.map(it => (
        <div key={it.id} className="border border-blue-900/30 rounded p-3 text-blue-200 flex items-center justify-between">
          <div className="truncate mr-3">{it.title}</div>
          <button onClick={()=>onDelete(it.id)} className="text-red-300 hover:text-red-200">Hapus</button>
        </div>
      )) : <div className="text-blue-300">Belum ada data.</div>}
    </div>
  )
}

function FormOne({ onSubmit, label, placeholder }) {
  const [a, setA] = useState('')
  return (
    <div>
      <div className="text-blue-200 text-sm mb-2">{label}</div>
      <input value={a} onChange={e=>setA(e.target.value)} placeholder={placeholder} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full" />
      <button onClick={()=>{ if(a.trim()) onSubmit(a); setA('') }} className="mt-3 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Tambah</button>
    </div>
  )
}

function FormTwo({ onSubmit, labels, placeholders }) {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <div className="text-blue-200 text-sm mb-2">{labels[0]}</div>
          <input value={a} onChange={e=>setA(e.target.value)} placeholder={placeholders[0]} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full" />
        </div>
        <div>
          <div className="text-blue-200 text-sm mb-2">{labels[1]}</div>
          <input value={b} onChange={e=>setB(e.target.value)} placeholder={placeholders[1]} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full" />
        </div>
      </div>
      <button onClick={()=>{ if(a.trim()) onSubmit(a,b); setA(''); setB('') }} className="mt-3 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Tambah</button>
    </div>
  )
}

function FormThree({ onSubmit, labels, placeholders }) {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <div className="text-blue-200 text-sm mb-2">{labels[0]}</div>
          <input value={a} onChange={e=>setA(e.target.value)} placeholder={placeholders[0]} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full" />
        </div>
        <div>
          <div className="text-blue-200 text-sm mb-2">{labels[1]}</div>
          <input value={b} onChange={e=>setB(e.target.value)} placeholder={placeholders[1]} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full" />
        </div>
        <div>
          <div className="text-blue-200 text-sm mb-2">{labels[2]}</div>
          <input value={c} onChange={e=>setC(e.target.value)} placeholder={placeholders[2]} className="bg-black/60 border border-blue-900/40 rounded px-3 py-2 text-blue-100 w-full" />
        </div>
      </div>
      <button onClick={()=>{ if(a.trim()&&b.trim()) onSubmit(a,b,c); setA(''); setB(''); setC('') }} className="mt-3 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white">Tambah</button>
    </div>
  )
}

export default function App() {
  const [section, setSection] = useState('Beranda')
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#060b13] to-black">
      <Navbar onNav={(x) => {
        setSection(x)
        const map = { 'TopUp':'topup', 'Top Rank':'toprank', 'Kalkulator':'calc', 'Admin':'admin', 'Login':'auth' }
        const id = map[x] || ''
        if (id) {
          setTimeout(()=>{ document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }) }, 10)
        } else if (x==='Beranda') window.scrollTo({ top:0, behavior:'smooth' })
      }} />
      <Hero />
      <div id="calc" className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><Products /></div>
          <div className="space-y-4"><Calculator /><TopRank /></div>
        </div>
      </div>
      <OrderForm />
      <Ratings />
      <Admin />
      <footer className="border-t border-blue-900/40 py-6 text-center text-blue-300/80">© {new Date().getFullYear()} Vechnost • Dibuat dengan nuansa hitam & biru</footer>
    </div>
  )
}

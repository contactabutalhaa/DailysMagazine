'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Globe,
  Twitter,
  Linkedin,
  ShieldCheck,
  Code,
  X,
} from 'lucide-react';
import { useAdmin } from '@/components/admin/AdminContext';
import { AuthorProfile } from '@/types/admin';
import { generatePersonSchema } from '@/lib/schema-generator';

export default function AuthorsManagerPage() {
  const { authors, saveAuthor, deleteAuthor, posts, showToast } = useAdmin();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorProfile | null>(null);
  const [previewingSchemaAuthor, setPreviewingSchemaAuthor] = useState<AuthorProfile | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [expertiseStr, setExpertiseStr] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');

  const openNewModal = () => {
    setEditingAuthor(null);
    setName('');
    setEmail('');
    setRole('Staff Writer');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    setBio('');
    setExpertiseStr('');
    setTwitter('');
    setLinkedin('');
    setWebsite('');
    setIsModalOpen(true);
  };

  const openEditModal = (author: AuthorProfile) => {
    setEditingAuthor(author);
    setName(author.name);
    setEmail(author.email || '');
    setRole(author.role || '');
    setAvatar(author.avatar);
    setBio(author.bio);
    setExpertiseStr(author.expertise?.join(', ') || '');
    setTwitter(author.socialLinks?.twitter || author.sameAs?.twitter || '');
    setLinkedin(author.socialLinks?.linkedin || author.sameAs?.linkedin || '');
    setWebsite(author.socialLinks?.website || author.sameAs?.website || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required', 'error');
      return;
    }

    const expertise = expertiseStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const sameAsObj = {
      twitter: twitter.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      website: website.trim() || undefined,
    };

    if (editingAuthor) {
      saveAuthor({
        id: editingAuthor.id,
        name,
        email,
        role,
        avatar,
        bio,
        expertise,
        sameAs: sameAsObj,
        socialLinks: sameAsObj,
      });
      showToast('Author persona updated successfully!', 'success');
    } else {
      saveAuthor({
        name,
        email,
        role,
        avatar,
        bio,
        expertise,
        sameAs: sameAsObj,
        socialLinks: sameAsObj,
      });
      showToast('New author persona created!', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, authorName: string) => {
    if (confirm(`Remove author profile for "${authorName}"?`)) {
      deleteAuthor(id);
      showToast('Author profile removed', 'info');
    }
  };

  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.role?.toLowerCase().includes(search.toLowerCase()) ||
      a.expertise?.some((e) => e.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif text-slate-900">Authors & E-E-A-T Profiles</h1>
            <button
              onClick={openNewModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Author Persona
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Strengthen Google E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) with verified Person schema.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search authors or expertise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
          />
        </div>
      </div>

      {/* Author Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => {
          const authorPostsCount = posts.filter(
            (p) => (p.author?.name || p.authorName) === author.name
          ).length;

          return (
            <div
              key={author.id}
              className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 border-2 border-orange-500/20 shadow-xs">
                  <Image src={author.avatar} alt={author.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base truncate">{author.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> E-E-A-T
                    </span>
                  </div>
                  <p className="text-xs text-orange-600 font-medium">{author.role}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{authorPostsCount} Published Articles</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{author.bio}</p>

              {/* Expertise Topics */}
              {author.expertise && author.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {author.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              )}

              {/* Social / SameAs links */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  {(author.socialLinks?.twitter || author.sameAs?.twitter) && (
                    <a
                      href={author.socialLinks?.twitter || author.sameAs?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 transition"
                      title="X / Twitter"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {(author.socialLinks?.linkedin || author.sameAs?.linkedin) && (
                    <a
                      href={author.socialLinks?.linkedin || author.sameAs?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {(author.socialLinks?.website || author.sameAs?.website) && (
                    <a
                      href={author.socialLinks?.website || author.sameAs?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-500 transition"
                      title="Website"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewingSchemaAuthor(author)}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                    title="View Person JSON-LD Schema"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(author)}
                    className="p-1 text-slate-400 hover:text-orange-600 hover:bg-slate-100 rounded transition"
                    title="Edit Author"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id, author.name)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition"
                    title="Delete Author"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Author Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                {editingAuthor ? `Edit Author: ${editingAuthor.name}` : 'New Editorial Author Persona'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Vance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="author@dailysmagazine.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Senior Urbanism Critic"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Author Bio (E-E-A-T Credibility)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Detail author background, publications, degrees, and awards..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Expertise Topics (Comma Separated)
                </label>
                <input
                  type="text"
                  value={expertiseStr}
                  onChange={(e) => setExpertiseStr(e.target.value)}
                  placeholder="Urban Planning, Clean Architecture, Public Space"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 text-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Authoritative SameAs / Social Profiles
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="url"
                    placeholder="Twitter/X URL"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900 text-xs"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900 text-xs"
                  />
                  <input
                    type="url"
                    placeholder="Personal Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded focus:outline-none text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded shadow-xs"
                >
                  {editingAuthor ? 'Update Author' : 'Save Author Persona'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON-LD Schema Modal */}
      {previewingSchemaAuthor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-orange-500" />
                Person JSON-LD: {previewingSchemaAuthor.name}
              </h3>
              <button onClick={() => setPreviewingSchemaAuthor(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <pre className="p-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-[11px] font-mono overflow-x-auto max-h-72">
              {JSON.stringify(generatePersonSchema(previewingSchemaAuthor), null, 2)}
            </pre>

            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(generatePersonSchema(previewingSchemaAuthor), null, 2)
                  );
                  showToast('Person schema copied to clipboard', 'success');
                }}
                className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded shadow-xs transition"
              >
                Copy JSON-LD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

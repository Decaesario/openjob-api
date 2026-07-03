import companyRepository from '../repositories/company-repositories.js';
import sendResponse from '../../utils/response.js';

class CompanyController {
  async createCompany(req, res, next) {
    try {
      const ownerId = req.user.id;
      const company = await companyRepository.addCompany({ ...req.body, ownerId });
      return sendResponse(res, {
        code: 201,
        status: 'success',
        message: 'Company berhasil dibuat',
        data: { id: company.id, name: company.name, location: company.location, description: company.description },
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllCompanies(req, res, next) {
    try {
      const companies = await companyRepository.getAllCompanies();
      return sendResponse(res, {
        code: 200,
        status: 'success',
        message: 'Companies berhasil didapatkan',
        data: { companies },
      });
    } catch (err) {
      next(err);
    }
  }

  async getCompanyById(req, res, next) {
    try {
      const { data, source } = await companyRepository.getCompanyById(req.params.id);
      res.setHeader('X-Data-Source', source);
      return sendResponse(res, {
        code: 200,
        status: 'success',
        message: 'Company berhasil didapatkan',
        data: { id: data.id, name: data.name, description: data.description, location: data.location, industry: data.industry, website: data.website, owner_id: data.owner_id },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCompany(req, res, next) {
    try {
      await companyRepository.verifyCompanyOwner(req.params.id, req.user.id);
      const company = await companyRepository.updateCompany(req.params.id, req.body);
      return sendResponse(res, {
        code: 200,
        status: 'success',
        message: 'Company berhasil diperbarui',
        data: { company },
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteCompany(req, res, next) {
    try {
      await companyRepository.verifyCompanyOwner(req.params.id, req.user.id);
      await companyRepository.deleteCompany(req.params.id);
      return sendResponse(res, {
        code: 200,
        status: 'success',
        message: 'Company berhasil dihapus',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new CompanyController();